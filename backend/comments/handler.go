package comments

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo"
)

type Handler struct {
	service *Service

	admins []string
}

func Register(repo Repository, srv *echo.Echo) (*Service, error) {
	service := Service{
		repo: repo,
	}

	handler := Handler{
		service: &service,
	}

	srv.POST("/api/comments/search", handler.search)

	s2 := service
	return &s2, nil
}

func (h *Handler) search(c echo.Context) error {
	defer c.Request().Body.Close()

	var searchParams struct {
		LogUUIDs []string `json:"logUuids"`
	}
	if err := json.NewDecoder(c.Request().Body).Decode(&searchParams); err != nil {
		return err
	}

	ctx := c.Request().Context()
	commentsPerLogUUID, err := h.service.GetByLogUUIDs(ctx, searchParams.LogUUIDs)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, commentsPerLogUUID)
}
