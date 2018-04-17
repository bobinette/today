import * as events from './events';

export const fetchLogs = () => ({ type: events.FETCH_LOGS });

export const onSearchChange = q => ({
  type: events.UPDATE_SEARCH,
  q,
});

export const onUpdate = (uuid, content, done) => ({
  type: events.UPDATE_LOG,
  uuid,
  content,
  done,
});
