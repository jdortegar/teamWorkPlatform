import { object } from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import routes from './routes';

console.log(ConnectedRouter);

const App = ({ store, history }) => {
   let DevTools = '';
   if (process.env.NODE_ENV !== 'production') {
      DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
   }

   return (
      <Provider store={store}>
         <div>
            <ConnectedRouter history={history}>
               {routes}
            </ConnectedRouter>
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
