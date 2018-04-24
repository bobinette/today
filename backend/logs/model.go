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
	Delete(ctx context.Context, uuid string) error

	// SaveTags should be called internally by Save. It is exposed here
	// for the loadTag method.
	// @TODO: Clean after yourself, kid!
	SaveTags(ctx context.Context, uuid string, tags []string) error
	SearchTags(ctx context.Context, user string, q string) (tags []string, err error)
}

type SearchParams struct {
	UUIDs []string
	Q     string
}

type Index interface {
	Index(ctx context.Context, log Log) error
	Delete(ctx context.Context, uuid string) error
	Search(ctx context.Context, params SearchParams) (uuids []string, err error)

	// SearchTags(ctx context.Context, uuids []string, q string) (tags []string, err error)
}
