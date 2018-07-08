package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/Sirupsen/logrus"
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/sandalwing/echo-logrusmiddleware"
	"github.com/spf13/viper"

	"github.com/bobinette/today/backend/comments"
	"github.com/bobinette/today/backend/eventsourcing"
	"github.com/bobinette/today/backend/logs"
	"github.com/bobinette/today/backend/logs/bleve"
	"github.com/bobinette/today/backend/mysql"
)

func main() {
	vp := viper.New()
	vp.SetConfigFile("conf.toml")

	// Parse env variables: replace the "." in th epath
	vp.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	vp.AutomaticEnv()

	// Set default values
	vp.SetDefault("mysql.host", "127.0.0.1")
	vp.SetDefault("mysql.port", "3306")
	vp.SetDefault("mysql.username", "root")
	vp.SetDefault("mysql.password", "root")
	vp.SetDefault("mysql.database", "today")

	vp.SetDefault("bleve.address", "./logs/bleve/index")

	vp.SetDefault("web.bind", ":9091")

	vp.SetDefault("app.dir", "")
	vp.SetDefault("app.proxy_to", "")

	vp.SetDefault("admins", "")

	vp.SetDefault("dev.forwarded_email", "")

	vp.ReadInConfig()

	var cfg struct {
		MySQL struct {
			Host     string `mapstructure:"host"`
			Port     string `mapstructure:"port"`
			Username string `mapstructure:"username"`
			Password string `mapstructure:"password"`
			Database string `mapstructure:"database"`
		} `mapstructure:"mysql"`

		Bleve struct {
			Address string `mapstructure:"address"`
		} `mapstructure:"bleve"`

		Web struct {
			Bind string `mapstructure:"bind"`
		} `mapstructure:"web"`

		App struct {
			Dir     string `mapstructure:"dir"`
			ProxyTo string `mapstructure:"proxy_to"`
		} `mapstructure:"app"`

		Admins []string `mapstructure:"admins"`

		Dev struct {
			ForwardedEmail string `mapstructure:"forwarded_email"`
		} `mapstructure:"dev"`
	}

	if err := vp.Unmarshal(&cfg); err != nil {
		log.Fatalln("could not read config file:", err)
	}

	mysqlAddr := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local",
		cfg.MySQL.Username,
		cfg.MySQL.Password,
		cfg.MySQL.Host,
		cfg.MySQL.Port,
		cfg.MySQL.Database,
	)

	db, err := sql.Open("mysql", mysqlAddr)
	if err != nil {
		log.Fatalln("error opening connection to MySQL:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalln("error pinging MySQL:", err)
	}

	index, err := bleve.Open(cfg.Bleve.Address)
	if err != nil {
		log.Fatalln("error opening bleve index:", err)
	}
	defer index.Close()

	// Create server + register routes
	srv := echo.New()

	echo.NotFoundHandler = func(c echo.Context) error {
		return fmt.Errorf("route %s (method %s) not found", c.Request().URL, c.Request().Method)
	}

	// Easier to read logger
	srv.Logger = logrusmiddleware.Logger{Logger: logrus.StandardLogger()}
	srv.Use(logrusmiddleware.Hook())

	srv.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	if cfg.Dev.ForwardedEmail != "" {
		srv.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
			return func(c echo.Context) error {
				if c.Request().Header.Get("X-Forwarded-Email") == "" {
					c.Request().Header.Set("X-Forwarded-Email", cfg.Dev.ForwardedEmail)
				}
				return next(c)
			}
		})
	}

	srv.HTTPErrorHandler = func(err error, c echo.Context) {
		code := http.StatusInternalServerError
		var msg interface{} = err.Error()

		if he, ok := err.(*echo.HTTPError); ok {
			code = he.Code
			msg = he.Message
		}

		c.JSON(code, map[string]interface{}{"error": msg})
	}

	logService, err := logs.Register(mysql.NewLogRepository(db), index, cfg.Admins, srv)
	if err != nil {
		log.Fatal(err)
	}

	commentService, err := comments.Register(mysql.NewCommentRepository(db), srv)
	if err != nil {
		log.Fatal(err)
	}

	if err := eventsourcing.Register(db, logService, commentService, srv); err != nil {
		log.Fatal(err)
	}

	// Assets - might be served by someone else.
	// Typically for the docker-compose the nginx container will serve the front
	if cfg.App.Dir != "" {
		srv.Static("/", cfg.App.Dir)
	} else if cfg.App.ProxyTo != "" {
		proxyURL, err := url.Parse(cfg.App.ProxyTo)
		if err != nil {
			log.Fatal(err)
		}
		g := srv.Group("/")
		g.Use(middleware.Proxy(middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{{URL: proxyURL}})))
	}

	if err := srv.Start(cfg.Web.Bind); err != nil {
		log.Fatal(err)
	}
}
