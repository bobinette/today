package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/BurntSushi/toml"
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"github.com/bobinette/today/backend/eventsourcing"
	"github.com/bobinette/today/backend/logs"
	"github.com/bobinette/today/backend/logs/mysql"
)

func main() {
	cfgData, err := ioutil.ReadFile("conf.toml")
	if err != nil {
		log.Fatalln("could not open config file:", err)
	}

	var cfg struct {
		MySQL struct {
			Host     string
			Port     string
			Username string
			Password string
			Database string
		} `toml:"mysql"`

		Web struct {
			Bind string
		}
	}

	if err := toml.Unmarshal(cfgData, &cfg); err != nil {
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

	// Create server + register routes
	srv := echo.New()

	echo.NotFoundHandler = func(c echo.Context) error {
		return fmt.Errorf("route %s (method %s) not found", c.Request().URL, c.Request().Method)
	}

	srv.Use(middleware.Logger())
	srv.HTTPErrorHandler = func(err error, c echo.Context) {
		code := http.StatusInternalServerError
		if he, ok := err.(*echo.HTTPError); ok {
			code = he.Code
		}

		if err == middleware.ErrJWTMissing {
			c.Redirect(http.StatusSeeOther, "/login")
			return
		}

		if code == http.StatusUnauthorized {
			c.Render(code, "login", nil)
			return
		}

		c.JSON(code, map[string]interface{}{"error": err.Error()})
	}

	if err := eventsourcing.Register(db, srv); err != nil {
		log.Fatal(err)
	}

	if err := logs.Register(mysql.NewLogRepository(db), srv); err != nil {
		log.Fatal(err)
	}

	if err := srv.Start(cfg.Web.Bind); err != nil {
		log.Fatal(err)
	}
}
