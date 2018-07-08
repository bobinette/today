package comments

import (
	"context"
	"errors"
	"fmt"

	eh "github.com/looplab/eventhorizon"
	"github.com/looplab/eventhorizon/eventhandler/projector"
)

// Projector is a projector of todo list events on the TodoList read model.
type Projector struct{}

// ProjectorType implements the ProjectorType method of the
// eventhorizon.Projector interface.
func (p *Projector) ProjectorType() projector.Type {
	return projector.Type(string(AggregateType) + "_projector")
}

// Project implements the Project method of the eventhorizon.Projector interface.
func (p *Projector) Project(ctx context.Context, event eh.Event, entity eh.Entity) (eh.Entity, error) {
	model, ok := entity.(*Comment)
	if !ok {
		return nil, errors.New("model is of incorrect type")
	}

	switch event.EventType() {
	case Created:
		data, ok := event.Data().(*CreatedData)
		if !ok {
			return nil, errors.New("invalid event data")
		}
		// Set the ID when first created.
		model.UUID = event.AggregateID()
		model.LogUUID = eh.UUID(data.LogUUID)
		model.User = data.User
		model.Content = data.Content
		model.CreatedAt = timeNow()
	case Updated:
		data, ok := event.Data().(*UpdatedData)
		if !ok {
			return nil, errors.New("invalid event data")
		}
		// Update only the content
		model.Content = data.Content
	case Removed:
		// Return a nil entity so the command handler wrapping the projector
		// calls the remove method on the "repo", i.e. the service in our case.
		return nil, nil
	default:
		// Also return the modele here to not delete it.
		return model, fmt.Errorf("could not project event: %s", event.EventType())
	}

	// Always increment the version and set update time on successful updates.
	model.Version++
	model.UpdatedAt = timeNow()
	return model, nil
}
