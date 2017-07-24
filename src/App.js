import React from 'react';
import { object } from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import routes from './routes';

const propTypes = {
  store: object.isRequired,
  history: object.isRequired
};

const App = ({ store, history }) => {
  let DevTools = '';
  if (process.env.NODE_ENV !== 'production') {
    DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          {routes}
          {(!window.devToolsExtension) && (process.env.NODE_ENV !== 'production') && <DevTools />}
        </div>
      </ConnectedRouter>
    </Provider>
  );
};

App.propTypes = propTypes;

export default App;
