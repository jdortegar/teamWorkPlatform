import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { LOGOUT_REQUEST } from 'src/actions';
import reduxHablaaiReducers from 'src/redux-hablaai/reducers';
import authReducer from './authReducer';
import sideBarReducer from './sideBarReducer';
import notificationsReducer from './notificationsReducer';

const mainReducer = history =>
  combineReducers({
    ...reduxHablaaiReducers,
    auth: authReducer,
    notifications: notificationsReducer,
    router: connectRouter(history),
    sideBar: sideBarReducer
  });

const initialState = mainReducer({})({}, {});

export default history => (state, action) => {
  if (action.type === LOGOUT_REQUEST) {
    // Clear out redux store upon logout, keep router state
    return mainReducer(history)({ ...initialState, router: state.router }, action);
  }
  return mainReducer(history)(state, action);
};
