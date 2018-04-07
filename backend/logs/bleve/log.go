package bleve

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/blevesearch/bleve"
	_ "github.com/blevesearch/bleve/analysis/analyzer/keyword"
	_ "github.com/blevesearch/bleve/analysis/analyzer/simple"
	"github.com/blevesearch/bleve/mapping"
	"github.com/blevesearch/bleve/search/query"

	"github.com/bobinette/today/backend/logs"
)

type Index struct {
	index bleve.Index
}

func Open(path string) (*Index, error) {
	index, err := bleve.Open(path)
	if err != nil {
		if err != bleve.ErrorIndexPathDoesNotExist {
			return nil, err
		}

		var m mapping.IndexMappingImpl
		err = json.Unmarshal([]byte(indexMapping), &m)
		if err != nil {
			return nil, err
		}

		index, err = bleve.New(path, &m)
		if err != nil {
			return nil, err
		}
	}

	return &Index{index: index}, nil
}

func (s *Index) Close() error {
	if s.index == nil {
		return nil
	}

	return s.index.Close()
}

func (s *Index) Index(ctx context.Context, log logs.Log) error {
	data := map[string]interface{}{
		"uuid":      log.UUID,
		"content":   log.Content,
		"createdAt": log.CreatedAt,
		"updatedAt": log.UpdatedAt,
	}

	return s.index.Index(log.UUID, data)
}

func (s *Index) Search(ctx context.Context, params logs.SearchParams) ([]string, error) {
	// Do not handle the offset for now
	total := 100 // Default...
	sr, err := s.index.Search(bleve.NewSearchRequest(query.NewMatchAllQuery()))
	if err != nil {
		return nil, err
	}
	total = int(sr.Total)

	query := andQ(
		query.NewMatchAllQuery(),
		s.searchQ(params.Q),
		searchUUIDs(params.UUIDs),
	)

	searchRequest := bleve.NewSearchRequest(query)
	searchRequest.Size = total

	sortBy := []string{"-createdAt"}
	searchRequest.SortBy(sortBy)

	searchResults, err := s.index.Search(searchRequest)
	if err != nil {
		return nil, err
	}

	uuids := make([]string, len(searchResults.Hits))
	for i, hit := range searchResults.Hits {
		uuids[i] = hit.ID
	}

	return uuids, nil
}

func andQ(qs ...query.Query) query.Query {
	ands := make([]query.Query, 0, len(qs))
	for _, q := range qs {
		if q != nil {
			ands = append(ands, q)
		}
	}

	if len(ands) == 0 {
		return nil
	}
	return query.NewConjunctionQuery(ands)
}

func orQ(qs ...query.Query) query.Query {
	ors := make([]query.Query, 0, len(qs))
	for _, q := range qs {
		if q != nil {
			ors = append(ors, q)
		}
	}

	if len(ors) == 0 {
		return nil
	}
	return query.NewDisjunctionQuery(ors)
}

func (s *Index) searchQ(queryString string) query.Query {
	words := strings.Fields(queryString)
	if len(words) == 0 {
		return nil
	}

	ands := make([]query.Query, 0, len(words))
	for _, word := range words {
		must := true
		if strings.HasPrefix(word, "-") {
			must = false
			word = word[1:]
		}

		q := s.matches(word, "content", must)
		ands = append(ands, q)
	}

	return andQ(ands...)
}

func (s *Index) matches(queryString, field string, must bool) query.Query {
	analyzer := s.index.Mapping().AnalyzerNamed(s.index.Mapping().AnalyzerNameForPath(field))
	tokens := analyzer.Analyze([]byte(queryString))
	if len(tokens) == 0 {
		return nil
	}

	conjuncts := make([]query.Query, len(tokens))
	for i, token := range tokens {
		conjuncts[i] = &query.PrefixQuery{
			Prefix:   string(token.Term),
			FieldVal: field,
		}
	}

	if !must {
		return query.NewBooleanQuery(nil, nil, conjuncts)
	}
	return query.NewConjunctionQuery(conjuncts)
}

func searchUUIDs(uuids []string) query.Query {
	return query.NewDocIDQuery(uuids)
}
