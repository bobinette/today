import { createSelector } from 'reselect';

const selectLogList = state => state.logList;

export const selectLogs = createSelector(selectLogList, state =>
  state.get('logs'),
);

export const selectQ = createSelector(selectLogList, state => state.get('q'));
