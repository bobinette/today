package mysql

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/bobinette/today/backend/comments"
)

type CommentRepository struct {
	db *sql.DB
}

func NewCommentRepository(db *sql.DB) *CommentRepository {
	return &CommentRepository{db: db}
}

func (r *CommentRepository) Find(ctx context.Context, uuid string) (comments.Comment, error) {
	query := `
	SELECT log_uuid, user, content, created_at, updated_at
	FROM comments
	WHERE uuid = ? AND deleted = 0
`
	res := r.db.QueryRowContext(ctx, query, uuid)

	var (
		logUUID   string
		user      string
		content   string
		createdAt time.Time
		updatedAt time.Time
	)

	if err := res.Scan(&logUUID, &user, &content, &createdAt, &updatedAt); err != nil {
		if err == sql.ErrNoRows {
			return comments.Comment{}, comments.ErrNotFound
		}

		return comments.Comment{}, err
	}
	return comments.Comment{
		UUID:      uuid,
		LogUUID:   logUUID,
		User:      user,
		Content:   content,
		CreatedAt: createdAt.In(time.UTC),
		UpdatedAt: updatedAt.In(time.UTC),
	}, nil
}

func (r *CommentRepository) GetByLogUUIDs(ctx context.Context, logUUIDs []string) (map[string][]comments.Comment, error) {
	query := fmt.Sprintf(`
	SELECT uuid, log_uuid, user, content, created_at, updated_at
	FROM comments
	WHERE log_uuid IN (%s) AND deleted = 0
`, join("?", ",", len(logUUIDs)))
	params := toInterfaceList(logUUIDs)
	rows, err := r.db.QueryContext(ctx, query, params...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	res := make(map[string][]comments.Comment)

	for rows.Next() {
		var (
			uuid      string
			logUUID   string
			user      string
			content   string
			createdAt time.Time
			updatedAt time.Time
		)

		if err := rows.Scan(&uuid, &logUUID, &user, &content, &createdAt, &updatedAt); err != nil {
			if err == sql.ErrNoRows {
				return nil, comments.ErrNotFound
			}

			return nil, err
		}

		res[logUUID] = append(res[logUUID], comments.Comment{
			UUID:      uuid,
			LogUUID:   logUUID,
			User:      user,
			Content:   content,
			CreatedAt: createdAt.In(time.UTC),
			UpdatedAt: updatedAt.In(time.UTC),
		})
	}

	return res, nil
}

func (r *CommentRepository) Save(ctx context.Context, comment comments.Comment) error {
	var query string
	var params []interface{}

	isInsert, err := r.isInsert(ctx, comment.UUID)
	if err != nil {
		return err
	}

	if isInsert {
		query = `
	INSERT INTO comments (uuid, log_uuid, user, content, deleted, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?)
`
		params = []interface{}{
			comment.UUID,
			comment.LogUUID,
			comment.User,
			comment.Content,
			false,
			comment.CreatedAt,
			comment.UpdatedAt,
		}
	} else {
		// Updating a deleted row restores it.
		query = `
	UPDATE comments
	SET content = ?, deleted = 0
	WHERE uuid = ?
`
		params = []interface{}{comment.Content, comment.UUID}
	}

	fmt.Printf("%+v\n", comment)
	if _, err := r.db.ExecContext(ctx, query, params...); err != nil {
		return err
	}
	return nil
}

func (r *CommentRepository) isInsert(ctx context.Context, uuid string) (bool, error) {
	query := `SELECT 1 FROM comments WHERE uuid = ?`
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

func (r *CommentRepository) Delete(ctx context.Context, uuid string) error {
	query := `UPDATE comments SET deleted = 1 WHERE uuid = ?`
	_, err := r.db.ExecContext(ctx, query, uuid)
	return err
}
