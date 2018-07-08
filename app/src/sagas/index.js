import { fork } from 'redux-saga/effects';

// Services
import commentsSagas from 'modules/comments/sagas';
import logListSagas from 'modules/log-list/sagas';
import newLogSagas from 'modules/new-log/sagas';

export default function* rootSaga() {
  yield [fork(logListSagas), fork(newLogSagas), fork(commentsSagas)];
}
