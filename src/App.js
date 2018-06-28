import React from 'react';
import { object } from 'prop-types';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'react-router-redux';
import routes from './routes';
import './layouts/styles/reset.css';
import './layouts/styles/habla-ui-styles.css';

const propTypes = {
  store: object.isRequired,
  persistor: object.isRequired,
  history: object.isRequired
};

const App = ({ store, persistor, history }) => (
  <LocaleProvider locale={enUS}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          <div>{routes}</div>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </LocaleProvider>
);

App.propTypes = propTypes;

export default App;
