package logs

import (
	eh "github.com/looplab/eventhorizon"
)

func init() {
	eh.RegisterCommand(func() eh.Command { return &Create{UUID: eh.NewUUID()} })
	eh.RegisterCommand(func() eh.Command { return &Update{} })
	eh.RegisterCommand(func() eh.Command { return &Remove{} })
}

// The command types available
const (
	CreateCommand eh.CommandType = "logs:create"
	UpdateCommand                = "logs:update"
	RemoveCommand                = "logs:remove"
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

// Update creates a new log.
type Update struct {
	UUID eh.UUID `json:"-"`

	User    string `json:"user"`
	Content string `json:"content"`
}

func (c *Update) AggregateType() eh.AggregateType { return AggregateType }
func (c *Update) AggregateID() eh.UUID            { return c.UUID }
func (c *Update) CommandType() eh.CommandType     { return UpdateCommand }

// The Remove command should be used to delete a log
type Remove struct {
	UUID eh.UUID `json:"-"`

	User string `json:"user"`
}

func (c *Remove) AggregateType() eh.AggregateType { return AggregateType }
func (c *Remove) AggregateID() eh.UUID            { return c.UUID }
func (c *Remove) CommandType() eh.CommandType     { return RemoveCommand }
