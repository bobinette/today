import { call, put, select, takeEvery } from 'redux-saga/effects';

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

export default function* sagas() {
  yield [takeEvery(events.CREATE_LOG, createLogSaga)];
}
