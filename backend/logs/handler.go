package logs

import (
	"net/http"

	"github.com/labstack/echo"
)

type Handler struct {
	service *Service
}

func Register(repo Repository, srv *echo.Echo) error {
	service := Service{
		repo: repo,
	}

	handler := Handler{
		service: &service,
	}
	srv.GET("/api/logs/:uuid", handler.get)
	return nil
}

func (h *Handler) get(c echo.Context) error {
	uuid := c.Param("uuid")
	log, err := h.service.Find(c.Request().Context(), uuid)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, log)
}
