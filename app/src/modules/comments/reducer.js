import { createReducer } from 'redux-create-reducer';
import { fromJS } from 'immutable';

import * as events from './events';

const initialState = fromJS({
  comments: {},
});

export const craftComment = comments =>
  fromJS({
    edited: {
      editing: false,
      content: '',
      updating: false,
    },
    source: comments,
  });

export default createReducer(initialState, {
  [events.RECEIVE_COMMENTS]: (state, { comments }) =>
    state.set('comments', fromJS(comments).map(craftComment)),
  [events.UPDATE_NEW_COMMENT]: (state, { logUuid, comment }) =>
    state.setIn(['comments', logUuid, 'edited', 'content'], comment),
  [events.APPEND_COMMENT]: (state, { logUuid, comment }) =>
    state.updateIn(['comments', logUuid, 'source'], comments =>
      comments.push(fromJS(comment)),
    ),
  [events.SAVING_COMMENT]: (state, { logUuid, saving }) =>
    state.setIn(['comments', logUuid, 'edited', 'updating'], saving),
});
