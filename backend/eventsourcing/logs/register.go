package logs

import (
	"database/sql"

	"github.com/labstack/echo"
	eh "github.com/looplab/eventhorizon"
	"github.com/looplab/eventhorizon/commandhandler/aggregate"
	"github.com/looplab/eventhorizon/eventhandler/projector"

	"github.com/bobinette/today/backend/logs"
	"github.com/bobinette/today/backend/logs/mysql"
)

func Register(
	db *sql.DB,
	bus eh.EventBus,
	store eh.AggregateStore,
	srv *echo.Echo,
) error {
	logsService := Service{
		service: logs.NewService(mysql.NewLogRepository(db)),
	}
	projector := projector.NewEventHandler(&Projector{}, &logsService)
	projector.SetEntityFactory(func() eh.Entity { return &Log{} })
	bus.AddHandler(projector, Created)

	commandHandler, err := aggregate.NewCommandHandler(AggregateType, store)
	if err != nil {
		return err
	}

	handler := httpHandler{
		commandHandler: commandHandler,
	}
	srv.POST("/api/logs", handler.create)
	return nil
}
