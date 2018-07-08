import { call, put, takeEvery } from 'redux-saga/effects';

import { toastr } from 'react-redux-toastr';

import * as logEvents from 'modules/log-list/events';

import api from './api';
import * as actions from './actions';
import * as events from './events';

export function* loadComments({ logUuids }) {
  const { comments, error } = yield call(api.fetchComments, logUuids);
  if (error) {
    const { message } = error;
    yield call(toastr.error, '', `Could not fetch the comments: ${message}`);
    return;
  }

  yield put(actions.receiveComments(comments));
}

export function* loadCommentsAfterLogReception({ logs }) {
  yield put(actions.fetchComments(logs.map(log => log.uuid)));
}

export function* saveComment({ logUuid, comment }) {
  yield put(actions.isSaving(logUuid, true));
  const { comment: newComment, error } = yield call(
    api.saveComment,
    logUuid,
    comment,
  );
  yield put(actions.isSaving(logUuid, false));
  if (error) {
    const { message } = error;
    yield call(toastr.error, '', `Could not save your comment: ${message}`);
    return;
  }

  yield put(actions.updateNewCommentValue(logUuid, ''));
  yield put(actions.appendComment(logUuid, newComment));
}

export default function* sagas() {
  yield [takeEvery([logEvents.LOGS_RECEIVED], loadCommentsAfterLogReception)];
  yield [takeEvery([events.FETCH_COMMENTS], loadComments)];
  yield [takeEvery([events.SAVE_COMMENT], saveComment)];
}
