import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { UNAUTH_USER } from '../actions/types';
// TODO: is this needed?  import registerReducer from './registerReducer';
import authReducer from './authReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import teamsReducer from './teamsReducer';
import teamRoomsReducer from './teamRoomsReducer';
import conversationsReducer from './conversationsReducer';
import integrationsReducer from './integrationsReducer';
// TODO: is this needed?  import dialogsReducer from './dialogsReducer';

const mainReducer = combineReducers({
  // TODO: is this needed?  register: registerReducer,
  // TODO: is this needed?  register: registerReducer,
  auth: authReducer,
  // TODO: is this needed?  dialogs: dialogsReducer,
  subscriberOrgs: subscriberOrgsReducer,
  teams: teamsReducer,
  teamRooms: teamRoomsReducer,
  conversations: conversationsReducer,
  integrations: integrationsReducer,
  form: formReducer,
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
