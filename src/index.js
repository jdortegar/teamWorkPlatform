import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { store, persistor, history } from './store';

ReactDOM.render(
  <BrowserRouter>
    <PersistGate persistor={persistor} loading={null}>
      <App store={store} persistor={persistor} history={history} />
    </PersistGate>
  </BrowserRouter>,
  document.getElementById('app')
);
