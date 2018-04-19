package logs

import (
	"time"

	eh "github.com/looplab/eventhorizon"
)

type Log struct {
	UUID    eh.UUID `json:"id"`
	Version int     `json:"version"`

	User    string `json:"user"`
	Content string `json:"content"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

var _ = eh.Entity(&Log{})

// EntityID implements the EntityID method of the eventhorizon.Entity interface.
func (t *Log) EntityID() eh.UUID {
	return t.UUID
}

// Restore when version are handled by the log service in this
// ES specific repo
// var _ = eh.Versionable(&Log{})
// AggregateVersion implements the AggregateVersion method of the
// eventhorizon.Versionable interface.
// func (t *Log) AggregateVersion() int {
// 	return t.Version
// }
