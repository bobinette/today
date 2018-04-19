import { createReducer } from 'redux-create-reducer';
import { fromJS } from 'immutable';

import * as events from './events';

const initialState = fromJS({
  logs: [],
  q: '',
});

export default createReducer(initialState, {
  [events.LOGS_RECEIVED]: (state, { logs }) => state.set('logs', fromJS(logs)),
  [events.UPDATE_SEARCH]: (state, { q }) => state.set('q', q),
  [events.LOG_UPDATED]: (state, action) => {
    const log = fromJS(action.log);
    const index = state
      .get('logs')
      .findIndex(l => l.get('uuid') === log.get('uuid'));
    if (index === -1) return state;

    return state.setIn(['logs', index], log);
  },
  [events.LOG_DELETED]: (state, { uuid }) => {
    const index = state.get('logs').findIndex(l => l.get('uuid') === uuid);
    if (index === -1) return state;

    return state.deleteIn(['logs', index]);
  },
});
