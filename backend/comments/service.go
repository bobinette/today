package comments

import (
	"context"
	"errors"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) Find(ctx context.Context, uuid string) (Comment, error) {
	return s.repo.Find(ctx, uuid)
}

func (s *Service) GetByLogUUIDs(ctx context.Context, logUUIDs []string) (map[string][]Comment, error) {
	return s.repo.GetByLogUUIDs(ctx, logUUIDs)
}

func (s *Service) Save(ctx context.Context, comment Comment) error {
	if comment.User == "" {
		return errors.New("the user is needed to add a comment")
	}

	return s.repo.Save(ctx, comment)
}

func (s *Service) Delete(ctx context.Context, uuid string) error {
	return s.repo.Delete(ctx, uuid)
}
