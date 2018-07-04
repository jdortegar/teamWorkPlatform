import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

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

const persistConfig = { key: 'root', storage };
const persistedReducer = persistReducer(persistConfig, rootReducer);

export function configureStore() {
  return new Promise((resolve) => {
    const store = createStore(persistedReducer, composeMiddleware());
    const persistor = persistStore(store);

    resolve({ store, persistor });
  });
}
