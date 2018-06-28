import React from 'react';
import { object } from 'prop-types';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import routes from './routes';
import './layouts/styles/reset.css';
import './layouts/styles/habla-ui-styles.css';

const propTypes = {
  store: object.isRequired,
  history: object.isRequired
};

const App = ({ store, history }) => (
  <LocaleProvider locale={enUS}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>{routes}</div>
      </ConnectedRouter>
    </Provider>
  </LocaleProvider>
);

App.propTypes = propTypes;

export default App;
