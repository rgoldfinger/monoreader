import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginStore from './stores/LoginStore';

import WriteApp from './components/WriteApp';
import EventsList from './components/EventsList';

var Routes = () => (
  <Router>
    <div>
      <Route path="/write/:eventId" component={WriteApp} />
      <Route exact path="/" component={EventsList} />
    </div>
  </Router>
);

LoginStore.init();

ReactDOM.render(<Routes />, document.getElementById('root'));
