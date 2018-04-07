package logs

import (
	"net/http"

	"github.com/labstack/echo"
)

type Handler struct {
	service *Service

	admins []string
}

func Register(repo Repository, index Index, admins []string, srv *echo.Echo) (*Service, error) {
	service := Service{
		repo:  repo,
		index: index,
	}

	handler := Handler{
		service: &service,

		admins: admins,
	}

	srv.GET("/api/logs/:uuid", handler.get)
	srv.GET("/api/logs", handler.list)

	srv.POST("/api/logs/reindex", handler.indexAll)

	s2 := service
	return &s2, nil
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

	q := c.QueryParam("q")

	logs, err := h.service.List(c.Request().Context(), user, q)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, logs)
}

func (h *Handler) indexAll(c echo.Context) error {
	user := c.Request().Header.Get("X-Forwarded-Email")
	if !stringIsSlice(user, h.admins) {
		return c.JSON(http.StatusForbidden, map[string]interface{}{"error": "only admins can trigger a reindex"})
	}

	if err := h.service.indexAll(c.Request().Context()); err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}

func stringIsSlice(str string, s []string) bool {
	for _, o := range s {
		if o == str {
			return true
		}
	}
	return false
}
