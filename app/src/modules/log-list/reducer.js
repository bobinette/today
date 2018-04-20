import { createReducer } from 'redux-create-reducer';
import { fromJS } from 'immutable';

import * as events from './events';

const initialState = fromJS({
  logs: [],
  q: '',
});

const findLogIndex = (state, uuid) =>
  state.get('logs').findIndex(l => l.getIn(['source', 'uuid']) === uuid);

export const craftLog = log => ({
  edited: {
    editing: false,
    content: '',
    updating: false,
  },
  source: log,
});

export default createReducer(initialState, {
  [events.LOGS_RECEIVED]: (state, { logs }) =>
    state.set('logs', fromJS(logs.map(craftLog))),
  [events.UPDATE_SEARCH]: (state, { q }) => state.set('q', q),
  // Update
  [events.START_EDITING_LOG]: (state, { uuid }) => {
    const index = findLogIndex(state, uuid);
    if (index === -1) return state;

    return state.setIn(
      ['logs', index, 'edited'],
      fromJS({
        editing: true,
        content: state.getIn(['logs', index, 'source', 'content']),
        updating: false,
      }),
    );
  },
  [events.EDIT_LOG]: (state, { uuid, content }) => {
    const index = findLogIndex(state, uuid);
    if (index === -1) return state;

    return state.setIn(['logs', index, 'edited', 'content'], content);
  },
  [events.STOP_EDITING_LOG]: (state, { uuid }) => {
    const index = findLogIndex(state, uuid);
    if (index === -1) return state;

    return state.setIn(
      ['logs', index, 'edited'],
      fromJS({
        editing: false,
        content: '',
        updating: false,
      }),
    );
  },
  [events.START_UPDATING]: (state, { uuid }) => {
    const index = findLogIndex(state, uuid);
    if (index === -1) return state;

    return state.setIn(['logs', index, 'edited', 'updating'], true);
  },
  [events.STOP_UPDATING]: (state, { uuid }) => {
    const index = findLogIndex(state, uuid);
    if (index === -1) return state;

    return state.setIn(['logs', index, 'edited', 'updating'], false);
  },
  [events.LOG_UPDATED]: (state, action) => {
    const log = fromJS(action.log);
    const index = findLogIndex(state, log.get('uuid'));
    if (index === -1) return state;

    return state.setIn(['logs', index, 'source'], fromJS(log));
  },
  // Delete
  [events.LOG_DELETED]: (state, { uuid }) => {
    const index = findLogIndex(state, uuid);
    if (index === -1) return state;

    return state.deleteIn(['logs', index]);
  },
});
