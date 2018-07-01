package comments

import (
	"time"

	eh "github.com/looplab/eventhorizon"
)

type Comment struct {
	UUID    eh.UUID `json:"id"`
	Version int     `json:"version"`

	LogUUID eh.UUID `json:"logUuid"`

	User    string `json:"user"`
	Content string `json:"content"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

var _ = eh.Entity(&Comment{})

// EntityID implements the EntityID method of the eventhorizon.Entity interface.
func (t *Comment) EntityID() eh.UUID {
	return t.UUID
}
