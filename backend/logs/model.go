package logs

import (
	"context"
	"errors"
	"time"
)

var (
	ErrLogNotFound = errors.New("log not found")
)

type Log struct {
	UUID string `json:"uuid"`

	Content string `json:"content"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Repository interface {
	// Read
	Find(ctx context.Context, uuid string) (Log, error)
	List(ctx context.Context) ([]Log, error)

	// Write
	Save(ctx context.Context, log Log) error
	// Remove(ctx context.Context, uuid string) error
}
