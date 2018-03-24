import { createSelector } from 'reselect';

const selectNewLog = state => state.newLog;

export const selectContent = createSelector(selectNewLog, state =>
  state.get('content'),
);
