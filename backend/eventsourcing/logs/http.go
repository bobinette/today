package logs

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/labstack/echo"
	eh "github.com/looplab/eventhorizon"
)

type httpHandler struct {
	commandHandler eh.CommandHandler
	logService     LogService
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

func (h *httpHandler) update(c echo.Context) error {
	defer c.Request().Body.Close()

	cmd, err := eh.CreateCommand(UpdateCommand)
	if err != nil {
		return err
	}

	if err := json.NewDecoder(c.Request().Body).Decode(&cmd); err != nil {
		return err
	}

	uuid := c.Param("uuid")
	log, err := h.logService.Find(c.Request().Context(), uuid)
	if err != nil {
		return err
	}

	user := c.Request().Header.Get("X-Forwarded-Email")
	if log.User != user {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "log not found"})
	}

	cmd.(*Update).UUID = eh.UUID(uuid)
	cmd.(*Update).User = user

	// New context to prevent long running tasks from being canceled when the request
	// is over.
	ctx := context.Background()
	return h.commandHandler.HandleCommand(ctx, cmd)
}
