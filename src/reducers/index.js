import { combineReducers } from "redux";
import homeReducer from "./homeReducer";
import subpageReducer from "./subpageReducer";
import authReducer from "./authReducer";
import { reducer as formReducer } from "redux-form";

const mainReducer = combineReducers({
  homeReducer,
  subpageReducer,
  authReducer,
  form: formReducer
});

export default mainReducer;
