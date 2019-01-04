import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

function composeMiddleware() {
  let middleware = [applyMiddleware(thunk), applyMiddleware(routerMiddleware(history))];

  if (process.env.REDUX_LOGGING) {
    const { logger } = require('redux-logger'); // eslint-disable-line global-require
    middleware = [...middleware, applyMiddleware(logger)];
  }

  return composeWithDevTools(...middleware);
}

const persistConfig = { key: 'root', storage };
const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

export const store = createStore(persistedReducer, composeMiddleware());
export const persistor = persistStore(store);
