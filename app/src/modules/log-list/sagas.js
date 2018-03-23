import { call, put, takeEvery } from 'redux-saga/effects';

import * as newLogEvents from 'modules/new-log/events';

import api from './api';
import * as events from './events';

export function* fetchLogsSaga() {
  const { logs } = yield call(api.fetchLogs);
  yield put({ type: events.LOGS_RECEIVED, logs });
}

export default function* sagas() {
  yield [
    takeEvery([events.FETCH_LOGS, newLogEvents.LOG_CREATED], fetchLogsSaga),
  ];
}
