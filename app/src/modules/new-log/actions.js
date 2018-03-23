import * as events from './events';

export const createLog = () => ({
  type: events.CREATE_LOG,
});

export const updateContent = content => ({
  type: events.UPDATE_CONTENT,
  content,
});
