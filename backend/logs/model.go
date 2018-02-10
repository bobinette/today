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
	UUID string

	Title   string
	Content string

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Repository interface {
	// Read
	Find(ctx context.Context, uuid string) (Log, error)
	// All(ctx context.Context) ([]Log, error)

	// Write
	Save(ctx context.Context, log Log) error
	// Remove(ctx context.Context, uuid string) error
}
