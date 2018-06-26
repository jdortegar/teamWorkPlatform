import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { getStoredState, createPersistor, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import config from './config/env';
import { sessionState, setPersistor, setStore } from './session';
import reduxHablaaiConfig from './redux-hablaai/config';

export const history = createHistory();

function composeMiddleware() {
  let middleware = [
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  ];

  if (process.env.REDUX_LOGGING) {
    const { logger } = require('redux-logger'); // eslint-disable-line global-require
    middleware = [...middleware, applyMiddleware(logger)];
  }

  return composeWithDevTools(...middleware);
}

export function configureStore() {
  reduxHablaaiConfig.hablaApiBaseUri = config.hablaApiBaseUri;
  const persistConfig = {};

  return new Promise((resolve) => {
    getStoredState(persistConfig, (err, restoredState) => {
      console.warn('ERROR RESTORING STATE', err);
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
