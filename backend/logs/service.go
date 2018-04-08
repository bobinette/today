package logs

import (
	"context"
	"errors"
)

type Service struct {
	repo  Repository
	index Index
}

func NewService(repo Repository, index Index) *Service {
	return &Service{
		repo:  repo,
		index: index,
	}
}

func (s *Service) Find(ctx context.Context, uuid string) (Log, error) {
	return s.repo.Find(ctx, uuid)
}

func (s *Service) List(ctx context.Context, user, q string) ([]Log, error) {
	uuids, err := s.repo.ListUUIDs(ctx, user)
	if err != nil {
		return nil, err
	}

	params := SearchParams{
		UUIDs: uuids,
		Q:     q,
	}
	uuids, err = s.index.Search(ctx, params)
	if err != nil {
		return nil, err
	}

	return s.repo.GetMultiple(ctx, uuids)
}

func (s *Service) Save(ctx context.Context, log Log) error {
	if log.User == "" {
		return errors.New("the user is needed to create a log")
	}

	if err := s.repo.Save(ctx, log); err != nil {
		return err
	}

	return s.index.Index(ctx, log)
}

func (s *Service) indexAll(ctx context.Context) error {
	logs, err := s.repo.All(ctx)
	if err != nil {
		return err
	}

	for _, log := range logs {
		if err := s.index.Index(ctx, log); err != nil {
			return err
		}
	}

	return nil
}
