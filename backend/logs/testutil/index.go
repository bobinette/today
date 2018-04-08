package testutil

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/bobinette/today/backend/logs"
)

func TestLogIndex(t *testing.T, index logs.Index) {
	kickOff := time.Date(1998, 7, 12, 21, 0, 0, 0, time.Local)
	secondHalf := kickOff.Add((46 + 15) * time.Minute)
	indexedLogs := []logs.Log{
		{UUID: "1", Content: "the game starts", CreatedAt: kickOff},
		{UUID: "2", Content: "Zidane scores his first goal", CreatedAt: kickOff.Add(27 * time.Minute)},
		{UUID: "3", Content: "Zidane scores again", CreatedAt: kickOff.Add((45 + 1) * time.Minute)},
		{UUID: "4", Content: "Desailly gets sent off", CreatedAt: secondHalf.Add(22 * time.Minute)},
		{UUID: "5", Content: "Petit scores, we are the champions", CreatedAt: secondHalf.Add((45 + 3) * time.Minute)},
	}

	ctx := context.Background()
	for _, log := range indexedLogs {
		err := index.Index(ctx, log)
		require.NoError(t, err) // Come on, you can't change History...
	}

	cases := map[string]struct {
		q        string
		uuids    []string
		expected []string
	}{
		"all": {
			q:        "",
			uuids:    []string{"1", "2", "3", "4", "5"},
			expected: []string{"5", "4", "3", "2", "1"},
		},
		"goaaaaaal!": {
			q:        "scores",
			uuids:    []string{"1", "2", "3", "4", "5"},
			expected: []string{"5", "3", "2"},
		},
		"Zizou twice": {
			q:        "scores Zidane",
			uuids:    []string{"1", "2", "3", "4", "5"},
			expected: []string{"3", "2"},
		},
		"Only Zizou": {
			q:        "scores",
			uuids:    []string{"1", "2", "3", "4"},
			expected: []string{"3", "2"},
		},
		"Only Manu": {
			q:        "scores",
			uuids:    []string{"5"},
			expected: []string{"5"},
		},
	}

	for name, tc := range cases {
		uuids, err := index.Search(ctx, logs.SearchParams{
			Q:     tc.q,
			UUIDs: tc.uuids,
		})

		assert.NoError(t, err, name)
		assert.Equal(t, tc.expected, uuids, name)
	}
}
