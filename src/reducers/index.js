import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { UNAUTH_USER } from '../actions/types';
// TODO: is this needed?  import registerReducer from './registerReducer';
import authReducer from './authReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import teamsReducer from './teamsReducer';
import teamRoomsReducer from './teamRoomsReducer';
import conversationsReducer from './conversationsReducer';
import integrationsReducer from './integrationsReducer';
import dialogsReducer from './dialogsReducer';

const mainReducer = combineReducers({
  // TODO: is this needed?  register: registerReducer,
  // TODO: is this needed?  register: registerReducer,
  auth: authReducer,
  dialogs: dialogsReducer,
  subscriberOrgs: subscriberOrgsReducer,
  teams: teamsReducer,
  teamRooms: teamRoomsReducer,
  conversations: conversationsReducer,
  integrations: integrationsReducer,
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
