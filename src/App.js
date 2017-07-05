import { object } from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import routes from './routes';

const App = ({ store, history }) => {
   let DevTools = '';
   if (process.env.NODE_ENV !== 'production') {
      DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
   }

   return (
      <Provider store={store}>
         <div>
            <Router history={history}>
               {routes}
            </Router>
            {(!window.devToolsExtension) && (process.env.NODE_ENV !== 'production') && <DevTools />}
         </div>
      </Provider>
   );
};

App.propTypes = {
   store: object.isRequired,
   history: object.isRequired
};

export default App;
