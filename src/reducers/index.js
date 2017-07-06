import { combineReducers } from "redux";
import homeReducer from "./homeReducer";
import subpageReducer from "./subpageReducer";
import { reducer as formReducer } from "redux-form";

const mainReducer = combineReducers({
  homeReducer,
  subpageReducer,
  form: formReducer
});

export default mainReducer;
