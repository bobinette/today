package logs

import (
	eh "github.com/looplab/eventhorizon"
)

const (
	// A Created event is used to signal that a log was created
	Created eh.EventType = "logs:created"
	// An Updated event is used to signal that a log was updated
	Updated eh.EventType = "logs:updated"
)

type CreatedData struct {
	UUID eh.UUID `json:"uuid"`

	User    string `json:"user"`
	Content string `json:"content"`
}

type UpdatedData struct {
	UUID eh.UUID `json:"uuid"`

	User    string `json:"user"`
	Content string `json:"content"`
}
