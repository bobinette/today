import { delay } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import * as newLogEvents from 'modules/new-log/events';

import api from './api';
import * as events from './events';
import { selectQ } from './selectors';

export function* fetchLogsSaga() {
  const q = yield select(selectQ);
  const { logs } = yield call(api.fetchLogs, q);
  yield put({ type: events.LOGS_RECEIVED, logs });
}

export function* fetchLogsDebouncedSaga() {
  yield call(delay, 500);
  yield call(fetchLogsSaga);
}

export function* updateLogSaga({ uuid, content, done }) {
  const { log } = yield call(api.updateLog, uuid, content);
  yield put({ type: events.LOG_UPDATED, log });
  if (done) {
    yield call(done);
  }
}

export default function* sagas() {
  yield [
    takeEvery([events.FETCH_LOGS, newLogEvents.LOG_CREATED], fetchLogsSaga),
    takeLatest([events.UPDATE_SEARCH], fetchLogsDebouncedSaga),
    takeEvery([events.UPDATE_LOG], updateLogSaga),
  ];
}
