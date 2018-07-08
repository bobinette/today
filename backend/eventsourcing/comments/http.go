package comments

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/labstack/echo"
	eh "github.com/looplab/eventhorizon"

	"github.com/bobinette/today/backend/logs"
)

type LogService interface {
	Find(ctx context.Context, uuid string) (logs.Log, error)
}

type httpHandler struct {
	commandHandler eh.CommandHandler
	commentService CommentService
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

	ctx := c.Request().Context()

	log, err := h.logService.Find(ctx, cmd.(*Create).LogUUID)
	if err != nil {
		return err
	}
	if log.User != user {
		return logs.ErrLogNotFound
	}

	if err := h.commandHandler.HandleCommand(ctx, cmd); err != nil {
		return err
	}

	comment, err := h.commentService.Find(ctx, string(cmd.AggregateID()))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, comment)
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
	ctx := c.Request().Context()
	log, err := h.commentService.Find(ctx, uuid)
	if err != nil {
		return err
	}

	user := c.Request().Header.Get("X-Forwarded-Email")
	if log.User != user {
		return &echo.HTTPError{
			Code:    http.StatusNotFound,
			Message: "log not found",
		}
	}

	cmd.(*Update).UUID = eh.UUID(uuid)
	cmd.(*Update).User = user

	if err := h.commandHandler.HandleCommand(ctx, cmd); err != nil {
		return err
	}

	log, err = h.commentService.Find(ctx, string(cmd.AggregateID()))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, log)
}

func (h *httpHandler) remove(c echo.Context) error {
	cmd, err := eh.CreateCommand(RemoveCommand)
	if err != nil {
		return err
	}

	uuid := c.Param("uuid")
	ctx := c.Request().Context()
	log, err := h.commentService.Find(ctx, uuid)
	if err != nil {
		return err
	}

	user := c.Request().Header.Get("X-Forwarded-Email")
	if log.User != user {
		return &echo.HTTPError{
			Code:    http.StatusNotFound,
			Message: "log not found",
		}
	}

	cmd.(*Remove).UUID = eh.UUID(uuid)
	cmd.(*Remove).User = user

	if err := h.commandHandler.HandleCommand(ctx, cmd); err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}
