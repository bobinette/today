import * as events from './events';

export const createLog = () => ({
  type: events.CREATE_LOG,
});

export const fetchLogs = () => ({ type: events.FETCH_LOGS });

export const updateTitle = title => ({ type: events.UPDATE_TITLE, title });
export const updateContent = content => ({
  type: events.UPDATE_CONTENT,
  content,
});

export const onSearchChange = q => ({
  type: events.UPDATE_SEARCH,
  q,
});
