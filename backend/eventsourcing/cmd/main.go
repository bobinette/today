package main

import (
	"context"
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"

	"github.com/BurntSushi/toml"
	_ "github.com/go-sql-driver/mysql"
	eh "github.com/looplab/eventhorizon"

	"github.com/bobinette/today/backend/eventsourcing"
	"github.com/bobinette/today/backend/eventsourcing/logs"
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

	commandHandler, err := eventsourcing.Register(db)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	cmd, err := eh.CreateCommand(logs.CreateCommand)
	if err != nil {
		log.Fatal(err)
	}

	cmd.(*logs.Create).UUID = eh.NewUUID()
	cmd.(*logs.Create).Title = "title"
	cmd.(*logs.Create).Content = "content"
	log.Printf("%+v", cmd)
	err = commandHandler.HandleCommand(ctx, cmd)
	if err != nil {
		log.Fatal(err)
	}
}
