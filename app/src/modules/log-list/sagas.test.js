import { call, put } from 'redux-saga/effects';

import api from './api';
import { LOGS_RECEIVED } from './events';
import { fetchLogsSaga } from './sagas';

jest.mock('./api');

test('fetch logs saga', () => {
  const logs = [{ uuid: 1 }, { uuid: 2 }];
  const gen = fetchLogsSaga();
  expect(gen.next().value).toEqual(call(api.fetchLogs));
  expect(gen.next({ logs }).value).toEqual(put({ type: LOGS_RECEIVED, logs }));
  expect(gen.next().done).toBe(true);
});
