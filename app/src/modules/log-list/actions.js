import * as events from './events';

export const fetchLogs = () => ({ type: events.FETCH_LOGS });

export const onSearchChange = q => ({
  type: events.UPDATE_SEARCH,
  q,
});

export const startEditing = uuid => ({
  type: events.START_EDITING_LOG,
  uuid,
});

export const edit = (uuid, content) => ({
  type: events.EDIT_LOG,
  uuid,
  content,
});

export const stopEditing = uuid => ({
  type: events.STOP_EDITING_LOG,
  uuid,
});

export const onUpdate = uuid => ({
  type: events.UPDATE_LOG,
  uuid,
});

export const deleteLog = uuid => ({
  type: events.DELETE_LOG,
  uuid,
});
