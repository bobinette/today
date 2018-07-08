package comments

import (
	"context"
	"errors"
	"time"
)

var (
	ErrNotFound = errors.New("not found")
)

type Comment struct {
	UUID    string `json:"uuid"`
	LogUUID string `json:"logUuid"`

	User    string `json:"user"`
	Content string `json:"content"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Repository interface {
	Find(ctx context.Context, uuid string) (Comment, error)

	GetByLogUUIDs(ctx context.Context, logUUIDs []string) (map[string][]Comment, error)

	Save(ctx context.Context, comment Comment) error
	Delete(ctx context.Context, uuid string) error
}
