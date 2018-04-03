package logs

import (
	// "fmt"
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
	srv.GET("/api/logs", handler.list)

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

func (h *Handler) list(c echo.Context) error {
	user := c.Request().Header.Get("X-Forwarded-Email")
	// fmt.Println(c.Request().Header, "\n")

	logs, err := h.service.List(c.Request().Context(), user)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, logs)
}
