package logs

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

func (s *Service) Find(ctx context.Context, uuid string) (Log, error) {
	return s.repo.Find(ctx, uuid)
}

func (s *Service) List(ctx context.Context, user string) ([]Log, error) {
	return s.repo.List(ctx, user)
}

func (s *Service) Save(ctx context.Context, log Log) error {
	if log.User == "" {
		return errors.New("the user is needed to create a log")
	}
	return s.repo.Save(ctx, log)
}
