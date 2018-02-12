import { call, put } from 'redux-saga/effects';

import { fetchLogs } from './actions';
import api from './api';
import { LOGS_RECEIVED } from './events';
import { createLogSaga, fetchLogsSaga } from './sagas';

jest.mock('./api');

test('create log saga', () => {
  const gen = createLogSaga({ title: 'title' });
  expect(gen.next().value).toEqual(call(api.createLog, { title: 'title' }));
  expect(gen.next().value).toEqual(put(fetchLogs()));
  expect(gen.next().done).toBe(true);
});

test('fetch logs saga', () => {
  const logs = [{ uuid: 1 }, { uuid: 2 }];
  const gen = fetchLogsSaga();
  expect(gen.next().value).toEqual(call(api.fetchLogs));
  expect(gen.next({ logs }).value).toEqual(put({ type: LOGS_RECEIVED, logs }));
  expect(gen.next().done).toBe(true);
});
