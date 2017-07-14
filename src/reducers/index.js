import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import homeReducer from "./homeReducer";
import subpageReducer from "./subpageReducer";
import registerReducer from "./registerReducer";
import authReducer from "./authReducer";
import integrationsReducer from './integrationsReducer';
import { reducer as formReducer } from "redux-form";

const mainReducer = combineReducers({
  homeReducer,
  subpageReducer,
  authReducer,
  registerReducer,
  integrationsReducer,
  form: formReducer,
  router: routerReducer
});

export default mainReducer;
