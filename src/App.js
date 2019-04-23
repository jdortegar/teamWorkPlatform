import React from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Router } from './routes';
import './layouts/styles/reset.css';
import './layouts/styles/habla-ui-styles.css';

const propTypes = {
  store: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const App = ({ store, persistor, history }) => (
  <LocaleProvider locale={enUS}>
    <Provider store={store}>
      <DragDropContextProvider backend={HTML5Backend}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={history}>
            <div>
              <Router />
            </div>
          </ConnectedRouter>
        </PersistGate>
      </DragDropContextProvider>
    </Provider>
  </LocaleProvider>
);

App.propTypes = propTypes;

export default App;
