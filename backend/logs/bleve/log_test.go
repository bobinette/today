package bleve

import (
	"encoding/json"
	"testing"

	"github.com/blevesearch/bleve"
	"github.com/blevesearch/bleve/mapping"
	"github.com/stretchr/testify/require"

	"github.com/bobinette/today/backend/logs/testutil"
)

func TestIndex(t *testing.T) {
	var m mapping.IndexMappingImpl
	err := json.Unmarshal([]byte(indexMapping), &m)
	require.NoError(t, err)

	index, err := bleve.NewMemOnly(&m)
	require.NoError(t, err)

	testutil.TestLogIndex(t, &Index{index: index})
}
