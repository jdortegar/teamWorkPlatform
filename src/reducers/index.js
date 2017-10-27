import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import reduxHablaaiReducers from '../redux-hablaai/reducers';
import { UNAUTH_USER } from '../actions/types';
import authReducer from './authReducer';
import notificationsReducer from './notificationsReducer';
import invitationsReducer from './invitationsReducer';
import integrationsReducer from './integrationsReducer';
import dialogsReducer from './dialogsReducer';

const mainReducer = combineReducers({
  ...reduxHablaaiReducers,
  auth: authReducer,
  dialogs: dialogsReducer,
  notifications: notificationsReducer,
  integrations: integrationsReducer,
  invitations: invitationsReducer,
  router: routerReducer
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
