package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"sort"
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
	var query string
	var params []interface{}

	isInsert, err := r.isInsert(ctx, log.UUID)
	if err != nil {
		return err
	}

	if isInsert {
		query = `INSERT INTO logs (uuid, user, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
		params = []interface{}{log.UUID, log.User, log.Content, log.CreatedAt, log.UpdatedAt}
	} else {
		query = `UPDATE logs SET content = ? WHERE uuid = ?`
		params = []interface{}{log.Content, log.UUID}
	}

	_, err = r.db.ExecContext(ctx, query, params...)
	return err
}

func (r *LogRepository) isInsert(ctx context.Context, uuid string) (bool, error) {
	query := `SELECT 1 FROM logs WHERE uuid = ?`
	row := r.db.QueryRowContext(ctx, query, uuid)

	var c int
	if err := row.Scan(&c); err != nil {
		if err == sql.ErrNoRows {
			return true, nil
		}
		return false, err
	}
	return false, nil
}

func (r *LogRepository) Find(ctx context.Context, uuid string) (logs.Log, error) {
	query := `SELECT user, content, created_at, updated_at FROM logs WHERE uuid = ?`
	res := r.db.QueryRowContext(ctx, query, uuid)

	var (
		user      string
		content   string
		createdAt time.Time
		updatedAt time.Time
	)

	if err := res.Scan(&user, &content, &createdAt, &updatedAt); err != nil {
		if err == sql.ErrNoRows {
			return logs.Log{}, logs.ErrLogNotFound
		}

		return logs.Log{}, err
	}
	return logs.Log{
		UUID:      uuid,
		User:      user,
		Content:   content,
		CreatedAt: createdAt.In(time.UTC),
		UpdatedAt: updatedAt.In(time.UTC),
	}, nil
}

func (r *LogRepository) GetMultiple(ctx context.Context, uuids []string) ([]logs.Log, error) {
	if len(uuids) == 0 {
		return []logs.Log{}, nil
	}

	query := fmt.Sprintf(`
	SELECT uuid, user, content, created_at, updated_at
	FROM logs
	WHERE uuid IN (%s)
`, join("?", ",", len(uuids)))

	params := make([]interface{}, len(uuids))
	for i, uuid := range uuids {
		params[i] = uuid
	}

	rows, err := r.db.QueryContext(ctx, query, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	logs, err := r.list(rows)
	if err != nil {
		return nil, err
	}

	uuidOrder := make(map[string]int)
	for i, uuid := range uuids {
		uuidOrder[uuid] = i
	}

	sort.Sort(&keepOrder{
		uuidOrder: uuidOrder,
		logs:      logs,
	})

	return logs, nil
}

func (r *LogRepository) List(ctx context.Context, user string) ([]logs.Log, error) {
	query := `
	SELECT uuid, user, content, created_at, updated_at
	FROM logs
	WHERE user = ?
	ORDER BY created_at DESC
`
	rows, err := r.db.QueryContext(ctx, query, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.list(rows)
}

func (r *LogRepository) ListUUIDs(ctx context.Context, user string) ([]string, error) {
	query := "SELECT uuid FROM logs WHERE user = ?"
	rows, err := r.db.QueryContext(ctx, query, user)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	uuids := make([]string, 0)
	for rows.Next() {
		var uuid string
		if err := rows.Scan(&uuid); err != nil {
			return nil, err
		}
		uuids = append(uuids, uuid)
	}

	if err := rows.Close(); err != nil {
		return nil, err
	}

	return uuids, nil
}

func (r *LogRepository) All(ctx context.Context) ([]logs.Log, error) {
	query := `
	SELECT uuid, user, content, created_at, updated_at
	FROM logs
	ORDER BY created_at DESC
`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.list(rows)
}

func (r *LogRepository) list(rows *sql.Rows) ([]logs.Log, error) {
	res := make([]logs.Log, 0)
	for rows.Next() {
		var (
			uuid      string
			logUser   string
			content   string
			createdAt time.Time
			updatedAt time.Time
		)

		if err := rows.Scan(&uuid, &logUser, &content, &createdAt, &updatedAt); err != nil {
			return nil, err
		}

		res = append(res, logs.Log{
			UUID:      uuid,
			User:      logUser,
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
