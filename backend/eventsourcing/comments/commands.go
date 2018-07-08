package comments

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
	CreateCommand eh.CommandType = "comments:create"
	UpdateCommand                = "comments:update"
	RemoveCommand                = "comments:remove"
)

// Create creates a new comment.
type Create struct {
	UUID eh.UUID `json:"-"`

	User    string `json:"user"`
	LogUUID string `json:"logUuid"`
	Content string `json:"content"`
}

func (c *Create) AggregateType() eh.AggregateType { return AggregateType }
func (c *Create) AggregateID() eh.UUID            { return c.UUID }
func (c *Create) CommandType() eh.CommandType     { return CreateCommand }

// Update creates a new comment.
type Update struct {
	UUID eh.UUID `json:"-"`

	User    string `json:"user"`
	Content string `json:"content"`
}

func (c *Update) AggregateType() eh.AggregateType { return AggregateType }
func (c *Update) AggregateID() eh.UUID            { return c.UUID }
func (c *Update) CommandType() eh.CommandType     { return UpdateCommand }

// The Remove command should be used to delete a comment
type Remove struct {
	UUID eh.UUID `json:"-"`

	User string `json:"user"`
}

func (c *Remove) AggregateType() eh.AggregateType { return AggregateType }
func (c *Remove) AggregateID() eh.UUID            { return c.UUID }
func (c *Remove) CommandType() eh.CommandType     { return RemoveCommand }
