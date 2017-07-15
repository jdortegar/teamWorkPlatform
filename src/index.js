import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { configureStore, history } from './store';
import './global-styles/index.global.scss';

export const store = configureStore(); // eslint-disable-line import/prefer-default-export

injectTapEventPlugin();

// Render main React component.
const render = (Component, props = {}) => {
  ReactDOM.render(
    <AppContainer>
      <Component {...props} />
    </AppContainer>
  , document.getElementById('app'));
};

render(App, { store, history });

// Hot Module Replacement API.
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App, { store, history });
  });
}
