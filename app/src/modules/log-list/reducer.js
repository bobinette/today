import { fromJS } from 'immutable';

import * as events from './events';

const initialState = fromJS({
  logs: [],
  q: '',
});

export default (state = initialState, action) => {
  switch (action.type) {
    case events.LOGS_RECEIVED:
      return state.set('logs', fromJS(action.logs));
    case events.UPDATE_SEARCH:
      return state.set('q', action.q);
    default:
      return state;
  }
};
