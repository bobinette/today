package logs

import (
	eh "github.com/looplab/eventhorizon"
)

func init() {
	eh.RegisterCommand(func() eh.Command { return &Create{UUID: eh.NewUUID()} })
}

const (
	// CreateCommand is the type for the Create command.
	CreateCommand = eh.CommandType("logs:create")
)

// Create creates a new log.
type Create struct {
	UUID eh.UUID `json:"-"`

	User    string `json:"user"`
	Content string `json:"content"`
}

func (c *Create) AggregateType() eh.AggregateType { return AggregateType }
func (c *Create) AggregateID() eh.UUID            { return c.UUID }
func (c *Create) CommandType() eh.CommandType     { return CreateCommand }
