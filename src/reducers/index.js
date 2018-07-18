import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import reduxHablaaiReducers from '../redux-hablaai/reducers';
import authReducer from './authReducer';
import sideBarReducer from './sideBarReducer';
import notificationsReducer from './notificationsReducer';
import { LOGOUT_REQUEST } from '../actions';

const mainReducer = combineReducers({
  ...reduxHablaaiReducers,
  auth: authReducer,
  notifications: notificationsReducer,
  router: routerReducer,
  sideBar: sideBarReducer
});

const initialState = mainReducer({}, {});

// Clear out redux store upon logout.
const rootReducer = (state, action) => {
  if (action.type === LOGOUT_REQUEST) {
    return mainReducer({ ...initialState, router: state.router }, action);
  }
  return mainReducer(state, action);
};

export default rootReducer;
