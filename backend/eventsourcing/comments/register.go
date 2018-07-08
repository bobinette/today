package comments

import (
	"github.com/labstack/echo"

	eh "github.com/looplab/eventhorizon"
	"github.com/looplab/eventhorizon/commandhandler/aggregate"
	"github.com/looplab/eventhorizon/eventhandler/projector"
)

func Register(
	service CommentService,
	logService LogService,
	bus eh.EventBus,
	store eh.AggregateStore,
	srv *echo.Echo,
) error {
	commentsService := Service{
		service: service,
	}
	projector := projector.NewEventHandler(&Projector{}, &commentsService)
	projector.SetEntityFactory(func() eh.Entity { return &Comment{} })
	bus.AddHandler(projector, Created)
	bus.AddHandler(projector, Updated)
	bus.AddHandler(projector, Removed)

	commandHandler, err := aggregate.NewCommandHandler(AggregateType, store)
	if err != nil {
		return err
	}

	handler := httpHandler{
		commandHandler: commandHandler,
		commentService: service,
		logService:     logService,
	}
	srv.POST("/api/comments", handler.create)
	srv.POST("/api/comments/:uuid", handler.update)
	srv.DELETE("/api/comments/:uuid", handler.remove)
	return nil
}
