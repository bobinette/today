import { delay } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { toastr } from 'react-redux-toastr';

import * as newLogEvents from 'modules/new-log/events';

import api from './api';
import * as events from './events';
import { selectQ, selectLogs } from './selectors';

const findLog = (logs, uuid) =>
  logs.find(l => l.getIn(['source', 'uuid']) === uuid);

export function* fetchLogsSaga() {
  const q = yield select(selectQ);
  const { logs, error } = yield call(api.fetchLogs, q);
  if (error) {
    const { message } = error;
    yield call(toastr.error, '', `Could not fetch your logs: ${message}`, {
      icon: 'toto',
    });
    return;
  }

  yield put({ type: events.LOGS_RECEIVED, logs });
}

export function* fetchLogsDebouncedSaga() {
  yield call(delay, 500);
  yield call(fetchLogsSaga);
}

export function* updateLogSaga({ uuid }) {
  const logs = yield select(selectLogs);
  const logToUpdate = findLog(logs, uuid);
  if (!logToUpdate) return;

  const content = logToUpdate.getIn(['edited', 'content']);

  yield put({ type: events.START_UPDATING, uuid });
  const { log, error } = yield call(api.updateLog, uuid, content);
  yield put({ type: events.STOP_UPDATING, uuid });

  if (error) {
    const { message } = error;
    yield call(toastr.error, '', `Could not fetch your logs: ${message}`);
    return;
  }

  yield put({ type: events.LOG_UPDATED, log });
  yield put({ type: events.STOP_EDITING_LOG, uuid });
}

export function* deleteLogSaga({ uuid }) {
  const r = yield call(confirm, 'Do you really want to delete your log?'); // eslint-disable-line no-restricted-globals
  if (!r) return;

  const { error } = yield call(api.deleteLog, uuid);
  if (error) {
    const { message } = error;
    yield call(toastr.error, '', `Could not fetch your logs: ${message}`, {
      icon: 'toto',
    });
    return;
  }

  yield put({ type: events.LOG_DELETED, uuid });
}

export default function* sagas() {
  yield [
    takeEvery([events.FETCH_LOGS, newLogEvents.LOG_CREATED], fetchLogsSaga),
    takeLatest([events.UPDATE_SEARCH], fetchLogsDebouncedSaga),
    takeEvery([events.UPDATE_LOG], updateLogSaga),
    takeEvery([events.DELETE_LOG], deleteLogSaga),
  ];
}
