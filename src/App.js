import { object } from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import routes from './routes';
import store from './store';

const App = ({ history }) => (
   <Provider store={store}>
      <Router history={history}>
         {routes}
      </Router>
   </Provider>
);

App.propTypes = {
   history: object.isRequired
};

export default App;
