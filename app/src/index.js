import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

// Init style before importing components
import 'style/base.scss';

// Import the assets
import 'assets/logo.png';
import 'assets/leaf-inverse.png';

import App from 'router';

// Sagas
import rootSaga from 'sagas';

// Reducers
import logListReducer from 'modules/log-list/reducer';
import newLogReducer from 'modules/new-log/reducer';

// Create store
const reducers = {
  logList: logListReducer,
  newLog: newLogReducer,
};
const reducer = combineReducers(reducers);

// Install the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middlewares = compose(
  applyMiddleware(sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);
const store = createStore(reducer, middlewares);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
