import createHistory from "history/createBrowserHistory";
import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

export const history = createHistory();

function composeMiddleware() {
  let middleware = [
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  ];

  if (process.env.NODE_ENV !== "production") {
    const DevTools = require("./containers/DevTools").default; // eslint-disable-line global-require
    middleware = [...middleware, DevTools.instrument()];
  }

  return compose(...middleware);
}

export function configureStore(initialState) {
  return createStore(rootReducer, initialState, composeMiddleware());
}
