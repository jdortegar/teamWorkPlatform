import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { UNAUTH_USER } from '../actions/types';
import authReducer from './authReducer';

const mainReducer = combineReducers({
  router: routerReducer,
  auth: authReducer
});

const initialState = mainReducer({}, {});

// Clear out redux store upon logout.
const rootReducer = (state, action) => {
  if (action.type === UNAUTH_USER) {
    return mainReducer({ ...initialState, router: state.router }, action);
  }
  return mainReducer(state, action);
};

export default rootReducer;
