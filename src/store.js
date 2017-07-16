import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import { getStoredState, createPersistor, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { sessionState, setPersistor, setStore } from './session';

export const history = createHistory();

function composeMiddleware() {
  let middleware = [
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  ];

  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('./containers/DevTools').default; // eslint-disable-line global-require
    middleware = [...middleware, DevTools.instrument()];
  }

  return compose(...middleware);
}

export function configureStore() {
  const persistConfig = {};

  return new Promise((resolve) => {
    getStoredState(persistConfig, (err, restoredState) => {
      const resolvedState = sessionState(restoredState);
      const store = createStore(rootReducer, resolvedState, composeMiddleware());
      const persistor = createPersistor(store, persistConfig);

      if (!resolvedState) {
        persistStore(store);
      }

      setStore(store);
      setPersistor(persistor);
      resolve(store);
    });
  });
}
