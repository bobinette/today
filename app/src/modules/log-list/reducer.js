import { fromJS } from 'immutable';

import { LOGS_RECEIVED } from './events';

const initialState = fromJS({
  logs: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGS_RECEIVED:
      return state.set('logs', fromJS(action.logs));
    default:
      return state;
  }
};
