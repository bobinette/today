import { fromJS } from 'immutable';

import * as events from './events';

const initialState = fromJS({
  logs: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case events.LOGS_RECEIVED:
      return state.set('logs', fromJS(action.logs));
    default:
      return state;
  }
};
