package logs

import (
	"github.com/labstack/echo"

	eh "github.com/looplab/eventhorizon"
	"github.com/looplab/eventhorizon/commandhandler/aggregate"
	"github.com/looplab/eventhorizon/eventhandler/projector"
)

func Register(
	service LogService,
	bus eh.EventBus,
	store eh.AggregateStore,
	srv *echo.Echo,
) error {
	logsService := Service{
		service: service,
	}
	projector := projector.NewEventHandler(&Projector{}, &logsService)
	projector.SetEntityFactory(func() eh.Entity { return &Log{} })
	bus.AddHandler(projector, Created)
	bus.AddHandler(projector, Updated)
	bus.AddHandler(projector, Removed)

	commandHandler, err := aggregate.NewCommandHandler(AggregateType, store)
	if err != nil {
		return err
	}

	handler := httpHandler{
		commandHandler: commandHandler,
		logService:     service,
	}
	srv.POST("/api/logs", handler.create)
	srv.POST("/api/logs/:uuid", handler.update)
	srv.DELETE("/api/logs/:uuid", handler.remove)
	return nil
}
