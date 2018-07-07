import * as events from './events';

export const fetchComments = logUuids => ({
  type: events.FETCH_COMMENTS,
  logUuids,
});

export const receiveComments = comments => ({
  type: events.RECEIVE_COMMENTS,
  comments,
});

export const saveComment = (logUuid, comment) => ({
  type: events.SAVE_COMMENT,
  logUuid,
  comment,
});

export const updateNewCommentValue = (logUuid, comment) => ({
  type: events.UPDATE_NEW_COMMENT,
  logUuid,
  comment,
});

export const isSaving = (logUuid, saving) => ({
  type: events.SAVING_COMMENT,
  logUuid,
  saving,
});

export const appendComment = (logUuid, comment) => ({
  type: events.APPEND_COMMENT,
  logUuid,
  comment,
});
