import { delay } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import api from './api';
import * as events from './events';
import { selectContent } from './selectors';

export function* createLogSaga() {
  const content = yield select(selectContent);

  const { error } = yield call(api.createLog, { content });
  if (error) {
    console.error(error);
    return;
  }

  yield put({ type: events.LOG_CREATED });
}

export function* detectTitleSaga() {
  // For debounce
  yield call(delay, 500);

  const content = yield select(selectContent);
  const hasTitle = /^#{1,6}[^#\n]+$/gm.test(content);

  yield put({
    type: events.TITLE_DETECTED,
    hasTitle,
  });
}

export default function* sagas() {
  yield [takeEvery(events.CREATE_LOG, createLogSaga)];
  yield [takeLatest(events.UPDATE_CONTENT, detectTitleSaga)];
}
