package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"io/ioutil"
	"os"
	"testing"

	"github.com/BurntSushi/toml"
	_ "github.com/go-sql-driver/mysql"
	"github.com/stretchr/testify/require"

	"github.com/bobinette/today/backend/logs/testutil"
)

func TestLogRepository(t *testing.T) {
	env := "test"
	if os.Getenv("TRAVIS") == "true" {
		env = "travis"
	}

	cfgData, err := ioutil.ReadFile(fmt.Sprintf("../conf.%s.toml", env))
	if err != nil {
		require.NoError(t, err)
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

	err = toml.Unmarshal(cfgData, &cfg)
	require.NoError(t, err)

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
		require.NoError(t, err)
	}

	ctx := context.Background()
	defer func() {
		// db.ExecContext(ctx, "DELETE FROM tags")
		// db.ExecContext(ctx, "DELETE FROM logs")
		db.Close()
	}()

	_, err = db.ExecContext(ctx, "DELETE FROM tags")
	require.NoError(t, err)
	_, err = db.ExecContext(ctx, "DELETE FROM logs")
	require.NoError(t, err)

	testutil.TestLogRepository(t, NewLogRepository(db))
}
