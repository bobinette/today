package logs

import (
	"context"
	"errors"
	"testing"
	"time"

	eh "github.com/looplab/eventhorizon"
	as "github.com/looplab/eventhorizon/aggregatestore/events"
	"github.com/looplab/eventhorizon/mocks"

	"github.com/stretchr/testify/assert"
)

func TestAggregate_HandleCommand(t *testing.T) {
	timeNow = func() time.Time {
		return time.Date(2014, time.May, 2, 12, 0, 0, 0, time.Local)
	}

	id := eh.NewUUID()
	cases := map[string]struct {
		agg    *Aggregate
		cmd    eh.Command
		events []eh.Event
		err    error
	}{
		"unknown command": {
			agg: &Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
				created:       true,
			},
			cmd: mocks.Command{
				ID: id,
			},
			events: nil,
			err:    errors.New("could not handle command: Command"),
		},
		"create": {
			agg: &Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
				created:       false,
			},
			cmd: &Create{UUID: id, Content: "content"},
			events: []eh.Event{
				eh.NewEventForAggregate(Created, &CreatedData{
					UUID:    id,
					Content: "content",
				}, timeNow(), AggregateType, id, 1),
			},
			err: nil,
		},
		"create - already created": {
			agg: &Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
				created:       true,
			},
			cmd:    &Create{UUID: id, Content: "content"},
			events: nil,
			err:    errors.New("already created"),
		},
	}

	ctx := context.Background()
	for name, testCase := range cases {
		err := testCase.agg.HandleCommand(ctx, testCase.cmd)
		assert.Equal(t, testCase.err, err, name)

		events := testCase.agg.Events()
		assert.Equal(t, testCase.events, events, name)
	}
}

func TestAggregate_ApplyEvent(t *testing.T) {
	timeNow = func() time.Time {
		return time.Date(2017, time.July, 10, 23, 0, 0, 0, time.Local)
	}

	id := eh.NewUUID()
	cases := map[string]struct {
		agg         *Aggregate
		event       eh.Event
		expectedAgg *Aggregate
		expectedErr error
	}{
		"unhandeled event": {
			&Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
			},
			eh.NewEventForAggregate(eh.EventType("unknown"), nil,
				timeNow(), AggregateType, id, 1),
			&Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
			},
			errors.New("could not apply event: unknown"),
		},
		"created": {
			&Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
			},
			eh.NewEventForAggregate(Created, nil,
				timeNow(), AggregateType, id, 1),
			&Aggregate{
				AggregateBase: as.NewAggregateBase(AggregateType, id),
				created:       true,
			},
			nil,
		},
	}

	ctx := context.Background()
	for name, testCase := range cases {
		err := testCase.agg.ApplyEvent(ctx, testCase.event)
		assert.Equal(t, testCase.expectedAgg, testCase.agg, name)
		assert.Equal(t, testCase.expectedErr, err, name)
	}
}