import { fromJS } from 'immutable';

import { LOGS_RECEIVED } from './events';
import reducer, { craftLog } from './reducer';

test('log list reducer', () => {
  const initialState = fromJS({
    logs: [],
  });

  const logs = [{ uuid: '1' }, { uuid: '2' }];
  const state = reducer(initialState, { type: LOGS_RECEIVED, logs });
  expect(state.get('logs')).toEqual(fromJS(logs.map(craftLog)));
});
