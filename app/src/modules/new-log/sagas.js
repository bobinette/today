import { delay } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { toastr } from 'react-redux-toastr';

import api from './api';
import * as events from './events';
import { selectContent } from './selectors';

export function* createLogSaga() {
  const content = yield select(selectContent);

  const { error } = yield call(api.createLog, { content });
  if (error) {
    const { message } = error;
    yield call(toastr.error, '', `Could not create log: ${message}`, {
      icon: 'toto',
    });
    return;
  }

  yield put({ type: events.LOG_CREATED });
}

export default function* sagas() {
  yield [takeEvery(events.CREATE_LOG, createLogSaga)];
}
