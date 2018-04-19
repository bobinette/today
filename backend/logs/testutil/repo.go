package testutil

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/bobinette/today/backend/logs"
)

func TestLogRepository(t *testing.T, repo logs.Repository) {
	var err error
	ctx := context.Background()
	user := "user"
	log := logs.Log{
		UUID:    "123",
		User:    user,
		Content: "This is a test log",

		CreatedAt: time.Date(1991, 5, 17, 0, 0, 0, 0, time.UTC),
		UpdatedAt: time.Date(1991, 5, 17, 0, 0, 0, 0, time.UTC),
	}

	_, err = repo.Find(ctx, "123")
	assert.Equal(t, logs.ErrLogNotFound, err)

	all, err := repo.List(ctx, user)
	assert.Equal(t, 0, len(all))
	assert.NoError(t, err)

	err = repo.Save(ctx, log)
	assert.NoError(t, err)

	retrieved, err := repo.Find(ctx, log.UUID)
	assert.NoError(t, err)
	assert.Equal(t, log, retrieved)

	all, err = repo.List(ctx, user)
	assert.NoError(t, err)
	assert.Equal(t, []logs.Log{log}, all)

	err = repo.Delete(ctx, log.UUID)
	assert.NoError(t, err)

	retrieved, err = repo.Find(ctx, log.UUID)
	assert.Equal(t, err, logs.ErrLogNotFound)
	assert.Equal(t, logs.Log{}, retrieved)

	all, err = repo.List(ctx, user)
	assert.NoError(t, err)
	assert.Equal(t, []logs.Log{}, all)
}
