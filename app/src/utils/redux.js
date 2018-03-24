export const separateActions = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...ownProps,
  actions: dispatchProps,
});
