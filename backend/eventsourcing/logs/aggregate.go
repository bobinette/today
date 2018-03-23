package logs

import (
	"context"
	"errors"
	"fmt"
	"time"

	eh "github.com/looplab/eventhorizon"
	"github.com/looplab/eventhorizon/aggregatestore/events"
)

func init() {
	eh.RegisterAggregate(func(id eh.UUID) eh.Aggregate {
		return &Aggregate{
			AggregateBase: events.NewAggregateBase(AggregateType, id),
		}
	})
}

// AggregateType is the aggregate type for the basic logging service.
const AggregateType = eh.AggregateType("logs")

// Aggregate is an aggregate for a log.
type Aggregate struct {
	*events.AggregateBase

	created bool
}

// timeNow is a mockable version of time.Now.
var timeNow = time.Now

// HandleCommand implements the HandleCommand method of the
// eventhorizon.CommandHandler interface.
func (a *Aggregate) HandleCommand(ctx context.Context, cmd eh.Command) error {
	switch cmd.(type) {
	case *Create:
		// An aggregate can only be created once.
		if a.created {
			return errors.New("already created")
		}
	default:
		// All other events require the aggregate to be created.
		if !a.created {
			return errors.New("not created")
		}
	}

	switch cmd := cmd.(type) {
	case *Create:
		a.StoreEvent(Created, &CreatedData{
			UUID:    cmd.AggregateID(),
			Content: cmd.Content,
		}, timeNow())
	default:
		return fmt.Errorf("could not handle command: %s", cmd.CommandType())
	}
	return nil
}

// ApplyEvent implements the ApplyEvent method of the
// eventhorizon.Aggregate interface.
func (a *Aggregate) ApplyEvent(ctx context.Context, event eh.Event) error {
	switch event.EventType() {
	case Created:
		a.created = true
	default:
		return fmt.Errorf("could not apply event: %s", event.EventType())
	}
	return nil
}
