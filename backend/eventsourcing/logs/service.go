package logs

import (
	"context"
	"errors"

	eh "github.com/looplab/eventhorizon"

	"github.com/bobinette/today/backend/logs"
)

type LogService interface {
	Find(ctx context.Context, uuid string) (logs.Log, error)
	Save(ctx context.Context, log logs.Log) error
	Delete(ctx context.Context, uuid string) error
}

type Service struct {
	service LogService
}

// Parent returns the parent read repository, if there is one.
// Useful for iterating a wrapped set of repositories to get a specific one.
func (s *Service) Parent() eh.ReadRepo {
	return nil
}

// Find returns an entity for an ID.
func (s *Service) Find(ctx context.Context, uuid eh.UUID) (eh.Entity, error) {
	l, err := s.service.Find(ctx, string(uuid))
	if err != nil {
		if err == logs.ErrLogNotFound {
			return nil, eh.RepoError{
				Err: eh.ErrEntityNotFound,
			}
		}
		return nil, err
	}

	ll := &Log{
		UUID:      eh.UUID(l.UUID),
		User:      l.User,
		Content:   l.Content,
		CreatedAt: l.CreatedAt,
		UpdatedAt: l.UpdatedAt,
	}
	return ll, nil
}

// FindAll returns all entities in the repository.
func (s *Service) FindAll(ctx context.Context) ([]eh.Entity, error) {
	return nil, errors.New("not implemented")
}

// Save saves a entity in the storage.
func (s *Service) Save(ctx context.Context, entity eh.Entity) error {
	ll, ok := entity.(*Log)
	if !ok {
		return errors.New("model is of incorrect type")
	}

	l := logs.Log{
		UUID:      string(ll.UUID),
		User:      ll.User,
		Content:   ll.Content,
		CreatedAt: ll.CreatedAt,
		UpdatedAt: ll.UpdatedAt,
	}

	return s.service.Save(ctx, l)
}

// Remove removes a entity by ID from the storage.
func (s *Service) Remove(ctx context.Context, uuid eh.UUID) error {
	return s.service.Delete(ctx, string(uuid))
}
