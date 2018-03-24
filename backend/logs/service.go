package logs

import (
	"context"
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

func (s *Service) List(ctx context.Context) ([]Log, error) {
	return s.repo.List(ctx)
}

func (s *Service) Save(ctx context.Context, log Log) error {
	return s.repo.Save(ctx, log)
}
