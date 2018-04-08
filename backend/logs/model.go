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

	User    string `json:"user"`
	Content string `json:"content"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Repository interface {
	// Read
	Find(ctx context.Context, uuid string) (Log, error)
	GetMultiple(ctx context.Context, uuids []string) ([]Log, error)

	List(ctx context.Context, user string) ([]Log, error)
	ListUUIDs(ctx context.Context, user string) ([]string, error)
	All(ctx context.Context) ([]Log, error)

	// Write
	Save(ctx context.Context, log Log) error
	// Remove(ctx context.Context, uuid string) error
}

type SearchParams struct {
	UUIDs []string
	Q     string
}

type Index interface {
	Index(ctx context.Context, log Log) error
	Search(ctx context.Context, params SearchParams) ([]string, error)
}
