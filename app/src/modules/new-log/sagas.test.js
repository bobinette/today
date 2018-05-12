import { call, put, select } from 'redux-saga/effects';

import api from './api';
import * as events from './events';
import { createLogSaga } from './sagas';
import { selectContent } from './selectors';

jest.mock('./api');

test('create log saga', () => {
  const gen = createLogSaga();
  expect(gen.next().value).toEqual(select(selectContent));
  expect(gen.next('content').value).toEqual(
    call(api.createLog, { content: 'content' }),
  );
  expect(gen.next({}).value).toEqual(put({ type: events.LOG_CREATED }));
  expect(gen.next().done).toBe(true);
});
