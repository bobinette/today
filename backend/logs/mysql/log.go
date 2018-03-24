package mysql

import (
	"context"
	"database/sql"
	"time"

	"github.com/bobinette/today/backend/logs"
)

var timeNow = time.Now

type LogRepository struct {
	db *sql.DB
}

func NewLogRepository(db *sql.DB) *LogRepository {
	return &LogRepository{db: db}
}

func (r *LogRepository) Save(ctx context.Context, log logs.Log) error {
	query := `INSERT INTO logs (uuid, content, created_at, updated_at) VALUES (?, ?, ?, ?)`
	params := []interface{}{log.UUID, log.Content, log.CreatedAt, log.UpdatedAt}

	_, err := r.db.ExecContext(ctx, query, params...)
	return err
}

func (r *LogRepository) Find(ctx context.Context, uuid string) (logs.Log, error) {
	query := `SELECT content, created_at, updated_at FROM logs WHERE uuid = ?`
	res := r.db.QueryRowContext(ctx, query, uuid)

	var (
		content   string
		createdAt time.Time
		updatedAt time.Time
	)

	if err := res.Scan(&content, &createdAt, &updatedAt); err != nil {
		if err == sql.ErrNoRows {
			return logs.Log{}, logs.ErrLogNotFound
		}

		return logs.Log{}, err
	}
	return logs.Log{
		UUID:      uuid,
		Content:   content,
		CreatedAt: createdAt.In(time.UTC),
		UpdatedAt: updatedAt.In(time.UTC),
	}, nil
}

func (r *LogRepository) List(ctx context.Context) ([]logs.Log, error) {
	query := `SELECT uuid, content, created_at, updated_at FROM logs ORDER BY created_at DESC`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	res := make([]logs.Log, 0)
	for rows.Next() {
		var (
			uuid      string
			content   string
			createdAt time.Time
			updatedAt time.Time
		)

		if err := rows.Scan(&uuid, &content, &createdAt, &updatedAt); err != nil {
			return nil, err
		}

		res = append(res, logs.Log{
			UUID:      uuid,
			Content:   content,
			CreatedAt: createdAt.In(time.UTC),
			UpdatedAt: updatedAt.In(time.UTC),
		})
	}

	if err := rows.Close(); err != nil {
		return nil, err
	}

	return res, nil
}
