package logs

import (
	"context"
	"errors"
	"testing"
	"time"

	eh "github.com/looplab/eventhorizon"

	"github.com/stretchr/testify/assert"
)

func TestProjector(t *testing.T) {
	timeNow = func() time.Time {
		return time.Date(2017, time.July, 10, 23, 0, 0, 0, time.Local)
	}

	id := eh.NewUUID()
	cases := map[string]struct {
		model         eh.Entity
		event         eh.Event
		expectedModel eh.Entity
		expectedErr   error
	}{
		"unhandeled event": {
			&Log{},
			eh.NewEventForAggregate(eh.EventType("unknown"), nil, timeNow(), AggregateType, id, 1),
			&Log{},
			errors.New("could not project event: unknown"),
		},
		"created": {
			&Log{},
			eh.NewEventForAggregate(Created, &CreatedData{
				User:    "user",
				Content: "content",
			}, timeNow(), AggregateType, id, 1),
			&Log{
				UUID:      id,
				Version:   1,
				User:      "user",
				Content:   "content",
				CreatedAt: timeNow(),
				UpdatedAt: timeNow(),
			},
			nil,
		},
	}

	ctx := context.Background()
	projector := &Projector{}
	for name, testCase := range cases {
		model, err := projector.Project(ctx, testCase.event, testCase.model)
		assert.Equal(t, testCase.expectedModel, model, name)
		assert.Equal(t, testCase.expectedErr, err, name)
	}
}
