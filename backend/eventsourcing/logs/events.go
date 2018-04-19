package logs

import (
	eh "github.com/looplab/eventhorizon"
)

// Events that can happen on a log
const (
	Created eh.EventType = "logs:created"
	Updated              = "logs:updated"
	Removed              = "logs:removed"
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

type RemovedData struct {
	UUID eh.UUID `json:"uuid"`
	User string  `json:"user"`
}
