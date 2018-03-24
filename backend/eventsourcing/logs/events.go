package logs

import (
	eh "github.com/looplab/eventhorizon"
)

const (
	Created eh.EventType = "logs:created"
)

type CreatedData struct {
	UUID    eh.UUID `json:"uuid"`
	Content string  `json:"content"`
}
