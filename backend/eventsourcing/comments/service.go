package comments

import (
	"context"
	"errors"

	eh "github.com/looplab/eventhorizon"

	"github.com/bobinette/today/backend/comments"
)

type CommentService interface {
	Find(ctx context.Context, uuid string) (comments.Comment, error)
	Save(ctx context.Context, log comments.Comment) error
	Delete(ctx context.Context, uuid string) error
}

type Service struct {
	service CommentService
}

// Parent returns the parent read repository, if there is one.
// Useful for iterating a wrapped set of repositories to get a specific one.
func (s *Service) Parent() eh.ReadRepo {
	return nil
}

// Find returns an entity for an ID.
func (s *Service) Find(ctx context.Context, uuid eh.UUID) (eh.Entity, error) {
	cmt, err := s.service.Find(ctx, string(uuid))
	if err != nil {
		if err == comments.ErrNotFound {
			return nil, eh.RepoError{
				Err: eh.ErrEntityNotFound,
			}
		}
		return nil, err
	}

	ll := &Comment{
		UUID:    eh.UUID(cmt.UUID),
		LogUUID: eh.UUID(cmt.LogUUID),

		User:    cmt.User,
		Content: cmt.Content,

		CreatedAt: cmt.CreatedAt,
		UpdatedAt: cmt.UpdatedAt,
	}

	return ll, nil
}

// FindAll returns all entities in the repository.
func (s *Service) FindAll(ctx context.Context) ([]eh.Entity, error) {
	return nil, errors.New("not implemented")
}

// Save saves a entity in the storage.
func (s *Service) Save(ctx context.Context, entity eh.Entity) error {
	ll, ok := entity.(*Comment)
	if !ok {
		return errors.New("model is of incorrect type")
	}

	l := comments.Comment{
		UUID:    string(ll.UUID),
		LogUUID: string(ll.LogUUID),

		User:    ll.User,
		Content: ll.Content,

		CreatedAt: ll.CreatedAt,
		UpdatedAt: ll.UpdatedAt,
	}

	return s.service.Save(ctx, l)
}

// Remove removes a entity by ID from the storage.
func (s *Service) Remove(ctx context.Context, uuid eh.UUID) error {
	return s.service.Delete(ctx, string(uuid))
}
