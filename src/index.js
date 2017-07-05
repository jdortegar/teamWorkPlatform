import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { configureStore, history } from './store';
import './global-styles/index.global.scss';

const store = configureStore();

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
