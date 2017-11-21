import React from 'react';
import { object } from 'prop-types';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
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
    <LocaleProvider locale={enUS}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            {routes}
            {(!window.devToolsExtension) && (process.env.NODE_ENV !== 'production') && <DevTools />}
          </div>
        </ConnectedRouter>
      </Provider>
    </LocaleProvider>
  );
};

App.propTypes = propTypes;

export default App;
