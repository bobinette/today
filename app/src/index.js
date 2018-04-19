import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

// Toastr
import ReduxToastr, { reducer as toastrReducer } from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

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

// Setup fontawesome
import './fontawesome';

// Create store
const reducers = {
  logList: logListReducer,
  newLog: newLogReducer,
  toastr: toastrReducer,
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
    <div>
      <App />
      <ReduxToastr
        newestOnTop
        preventDuplicates
        timeOut={3000}
        transitionIn="fadeIn"
        transitionOut="fadeOut"
      />
    </div>
  </Provider>,
  document.getElementById('app'),
);
