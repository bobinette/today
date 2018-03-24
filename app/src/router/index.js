import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import NavBar from 'components/navbar';

import LogList from 'modules/log-list';

const App = () => (
  <div>
    <NavBar />
    <Router>
      <Switch>
        <Route path="/" component={LogList} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </div>
);

export default App;
