package comments

import (
	eh "github.com/looplab/eventhorizon"
)

// Events that can happen on a comment
const (
	Created eh.EventType = "comments:created"
	Updated              = "comments:updated"
	Removed              = "comments:removed"
)

type CreatedData struct {
	UUID eh.UUID `json:"uuid"`

	User    string `json:"user"`
	LogUUID string `json:"logUuid"`
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
