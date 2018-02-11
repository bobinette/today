package mysql

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	eh "github.com/looplab/eventhorizon"
)

type EventStore struct {
	db *sql.DB
}

func NewEventStore(db *sql.DB) *EventStore {
	return &EventStore{
		db: db,
	}
}

// Save appends all events in the event stream to the store.
func (es *EventStore) Save(ctx context.Context, events []eh.Event, originalVersion int) error {
	if len(events) == 0 {
		return eh.EventStoreError{
			Err:       eh.ErrNoEventsToAppend,
			Namespace: eh.NamespaceFromContext(ctx),
		}
	}

	tx, err := es.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	aggregateID := events[0].AggregateID()
	for i, event := range events {
		if aggregateID != event.AggregateID() {
			return eh.EventStoreError{
				Err:       eh.ErrInvalidEvent,
				Namespace: eh.NamespaceFromContext(ctx),
			}
		}

		if event.Version() != originalVersion+i+1 {
			return eh.EventStoreError{
				Err:       eh.ErrIncorrectEventVersion,
				Namespace: eh.NamespaceFromContext(ctx),
			}
		}

		data, err := json.Marshal(event.Data())
		if err != nil {
			return err
		}

		if _, err := tx.ExecContext(ctx, `
            INSERT INTO events (aggregateType, uuid, version, eventType, data, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `, event.AggregateType(), event.AggregateID(), event.Version(), event.EventType(), string(data), event.Timestamp()); err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

// Load loads all events for the aggregate id from the store.
func (es *EventStore) Load(ctx context.Context, uuid eh.UUID) ([]eh.Event, error) {
	rows, err := es.db.QueryContext(
		ctx,
		"SELECT aggregateType, uuid, version, eventType, data, timestamp FROM events WHERE uuid = ?",
		uuid,
	)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	events := make([]eh.Event, 0)
	for rows.Next() {
		var event dbEvent
		var data []byte
		if err := rows.Scan(&event.aggregateType, &event.aggregateID, &event.version, &event.eventType, &data, &event.timestamp); err != nil {
			return nil, err
		}

		if eventData, err := eh.CreateEventData(event.eventType); err == nil {
			if err := json.Unmarshal(data, &eventData); err != nil {
				return nil, err
			}
			event.data = eventData
		}

		events = append(events, event)
	}

	if err := rows.Close(); err != nil {
		return nil, err
	}

	return events, nil
}

type dbEvent struct {
	aggregateType eh.AggregateType `json:"aggregateType"`
	aggregateID   eh.UUID          `json:"uuid"`
	version       int              `json:"version"`
	eventType     eh.EventType     `json:"eventType"`
	data          eh.EventData     `json:"data"`
	timestamp     time.Time        `json:"timestamp"`
}

// AggrgateID implements the AggrgateID method of the eventhorizon.Event interface.
func (e dbEvent) AggregateID() eh.UUID {
	return e.aggregateID
}

// AggregateType implements the AggregateType method of the eventhorizon.Event interface.
func (e dbEvent) AggregateType() eh.AggregateType {
	return e.aggregateType
}

// EventType implements the EventType method of the eventhorizon.Event interface.
func (e dbEvent) EventType() eh.EventType {
	return e.eventType
}

// Data implements the Data method of the eventhorizon.Event interface.
func (e dbEvent) Data() eh.EventData {
	return e.data
}

// Version implements the Version method of the eventhorizon.Event interface.
func (e dbEvent) Version() int {
	return e.version
}

// Timestamp implements the Timestamp method of the eventhorizon.Event interface.
func (e dbEvent) Timestamp() time.Time {
	return e.timestamp
}

// String implements the String method of the eventhorizon.Event interface.
func (e dbEvent) String() string {
	return fmt.Sprintf("%s@%d", e.eventType, e.version)
}
