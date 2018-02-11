import { call, put, takeEvery } from 'redux-saga/effects';

import api from './api';
import { CREATE_LOG, FETCH_LOGS, LOGS_RECEIVED } from './events';

export function* createLogSaga({ title, content }) {
  yield call(api.createLog, { title, content });
  yield put({ type: FETCH_LOGS });
}

export function* fetchLogsSaga() {
  const { logs } = yield call(api.fetchLogs);
  yield put({ type: LOGS_RECEIVED, logs });
}

export default function* sagas() {
  yield [
    takeEvery(FETCH_LOGS, fetchLogsSaga),
    takeEvery(CREATE_LOG, createLogSaga),
  ];
}
