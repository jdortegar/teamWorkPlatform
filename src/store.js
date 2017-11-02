import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { getStoredState, createPersistor, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import config from './config/env';
import { sessionState, setPersistor, setStore } from './session';
import reduxHablaaiConfig from './redux-hablaai/config';
import logger from 'redux-logger';

export const history = createHistory();

function composeMiddleware() {
  let middleware = [
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  ];

  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
    const { logger } = require(`redux-logger`);
    middleware = [...middleware, DevTools.instrument(), applyMiddleware(logger)];
  }

  return compose(...middleware);
}

export function configureStore() {
  reduxHablaaiConfig.hablaApiBaseUri = config.hablaApiBaseUri;
  const persistConfig = {};

  return new Promise((resolve) => {
    getStoredState(persistConfig, (err, restoredState) => {
      const resolvedState = sessionState(restoredState);
      const store = createStore(rootReducer, resolvedState, composeMiddleware());
      const persistor = createPersistor(store, persistConfig);

      if (!resolvedState) {
        persistStore(store);
      }

      reduxHablaaiConfig.store = store;
      setStore(store);
      setPersistor(persistor);
      resolve(store);
    });
  });
}
