import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { initMessaging, isAuthenticated } from './session';
import { configureStore, history } from './store';

configureStore()
  .then(({ store, persistor }) => {
    // Render main React component.
    const render = (Component, props = {}) => {
      ReactDOM.render(
        <AppContainer>
          <BrowserRouter>
            <Component {...props} />
          </BrowserRouter>
        </AppContainer>
        , document.getElementById('app'));
    };

    render(App, { store, persistor, history });

    // Hot Module Replacement API.
    if (module.hot) {
      module.hot.accept('./App', () => {
        render(App, { store, persistor, history });
      });
    }
  })
  .then(() => {
    if (isAuthenticated()) {
      initMessaging();
    }
  });
