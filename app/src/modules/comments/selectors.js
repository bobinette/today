import { createSelector } from 'reselect';

const selectCommentsState = state => state.comments;

export const selectComments = createSelector(selectCommentsState, state =>
  state.get('comments'),
);

