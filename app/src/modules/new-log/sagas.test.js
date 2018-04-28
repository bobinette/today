import { delay } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import api from './api';
import * as events from './events';
import { createLogSaga, detectTitleSaga } from './sagas';
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

test('detect title saga - true', () => {
  const gen = detectTitleSaga();
  expect(gen.next().value).toEqual(call(delay, 500)); // debounce
  expect(gen.next().value).toEqual(select(selectContent));
  expect(
    gen.next(`
# Title here
The title should be detected
  `).value,
  ).toEqual(put({ type: events.TITLE_DETECTED, hasTitle: true }));
  expect(gen.next().done).toBe(true);
});

test('detect title saga - false', () => {
  const gen = detectTitleSaga();
  expect(gen.next().value).toEqual(call(delay, 500)); // debounce
  expect(gen.next().value).toEqual(select(selectContent));
  expect(
    gen.next(`
#noTitle
No title should be detected: space missing
  `).value,
  ).toEqual(put({ type: events.TITLE_DETECTED, hasTitle: false }));
  expect(gen.next().done).toBe(true);
});
