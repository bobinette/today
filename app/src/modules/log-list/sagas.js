import { call, put, takeEvery } from 'redux-saga/effects';

import { fetchLogs } from './api';
import { FETCH_LOGS, LOGS_RECEIVED } from './events';

export function* fetchLogsSaga() {
  const logs = yield call(fetchLogs);
  yield put({ type: LOGS_RECEIVED, logs });
}

export default function* sagas() {
  yield [takeEvery(FETCH_LOGS, fetchLogsSaga)];
}
