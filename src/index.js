import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LoginStore from './stores/LoginStore';

import WriteApp from './components/WriteApp';
import EventsList from './components/EventsList';

// var stub = createReactClass({
//   render() {
//     return <RouteHandler />;
//   }
// });

var Routes = () => (
  <Router>
    <div>
      <Route path="/write/:eventId" component={WriteApp} />
      <Route exact path="/" component={EventsList} />
    </div>
  </Router>
);

// Init
LoginStore.init();
//
// ReactRouter.run(routes, function (Handler) {
//   React.render(<Routes/>, document.body);
// });

ReactDOM.render(<Routes />, document.getElementById('root'));
