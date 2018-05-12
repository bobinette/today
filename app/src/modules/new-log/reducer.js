import { createReducer } from 'redux-create-reducer';
import { fromJS } from 'immutable';

import * as events from './events';

const initialState = fromJS({
  content: '',
});

export default createReducer(initialState, {
  [events.LOG_CREATED]: () => initialState,
  [events.UPDATE_CONTENT]: (state, { content }) =>
    state.set('content', content),
});
