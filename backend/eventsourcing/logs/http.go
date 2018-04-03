package logs

import (
	"context"
	"encoding/json"

	"github.com/labstack/echo"
	eh "github.com/looplab/eventhorizon"
)

type httpHandler struct {
	commandHandler eh.CommandHandler
}

func (h *httpHandler) create(c echo.Context) error {
	defer c.Request().Body.Close()

	cmd, err := eh.CreateCommand(CreateCommand)
	if err != nil {
		return err
	}

	if err := json.NewDecoder(c.Request().Body).Decode(&cmd); err != nil {
		return err
	}

	user := c.Request().Header.Get("X-Forwarded-Email")
	cmd.(*Create).User = user

	// New context to prevent long running tasks from being canceled when the request
	// is over.
	ctx := context.Background()
	return h.commandHandler.HandleCommand(ctx, cmd)
}
