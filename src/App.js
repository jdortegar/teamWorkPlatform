import { object } from 'prop-types';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import routes from './routes';

const App = ({ store, history }) => {
   let DevTools = '';
   if (process.env.NODE_ENV !== 'production') {
      DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
   }

   return (
     <MuiThemeProvider>
      <Provider store={store}>
         <div>
            <ConnectedRouter history={history}>
               {routes}
            </ConnectedRouter>
            {(!window.devToolsExtension) && (process.env.NODE_ENV !== 'production') && <DevTools />}
         </div>
      </Provider>
    </MuiThemeProvider>
   );
};

App.propTypes = {
   store: object.isRequired,
   history: object.isRequired
};

export default App;
