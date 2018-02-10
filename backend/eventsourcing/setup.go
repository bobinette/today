package eventsourcing

import (
	"context"
	"database/sql"
	"log"

	"github.com/labstack/echo"
	eh "github.com/looplab/eventhorizon"
	aggregateStore "github.com/looplab/eventhorizon/aggregatestore/events"
	bus "github.com/looplab/eventhorizon/eventbus/local"
	store "github.com/looplab/eventhorizon/eventstore/memory"
	publisher "github.com/looplab/eventhorizon/publisher/local"

	"github.com/bobinette/today/backend/eventsourcing/logs"
)

// Logger is a simple event handler for logging all events.
type Logger struct{}

// Notify implements the Notify method of the EventObserver interface.
func (l *Logger) Notify(ctx context.Context, event eh.Event) {
	log.Printf("EVENT %s", event)
}

func Register(db *sql.DB, srv *echo.Echo) error {
	// Let's use the local publisher to start with
	publisher := publisher.NewEventPublisher()
	publisher.AddObserver(&Logger{})

	bus := bus.NewEventBus()
	bus.SetPublisher(publisher)

	store := store.NewEventStore()
	aggregateStore, err := aggregateStore.NewAggregateStore(store, bus)
	if err != nil {
		return err
	}

	if err := logs.Register(db, bus, aggregateStore, srv); err != nil {
		return err
	}

	return nil
}
