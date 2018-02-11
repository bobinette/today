import { fork } from 'redux-saga/effects';

// Services
import logListSagas from 'modules/log-list/sagas';

export default function* rootSaga() {
    yield [fork(logListSagas)];
}
