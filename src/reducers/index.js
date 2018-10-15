import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { LOGOUT_REQUEST } from 'src/actions';
import reduxHablaaiReducers from 'src/redux-hablaai/reducers';
import authReducer from './authReducer';
import sideBarReducer from './sideBarReducer';
import notificationsReducer from './notificationsReducer';

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
