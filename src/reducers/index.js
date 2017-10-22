import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { UNAUTH_USER } from '../actions/types';
import urlRequestsReducer from './urlRequestsReducer';
import authReducer from './authReducer';
import usersReducer from './usersReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import subscribersReducer from './subscribersReducer';
import teamsReducer from './teamsReducer';
import teamMembersReducer from './teamMembersReducer';
import teamRoomsReducer from './teamRoomsReducer';
import teamRoomMembersReducer from './teamRoomMembersReducer';
import conversationsReducer from './conversationsReducer';
import invitationsReducer from './invitationsReducer';
import integrationsReducer from './integrationsReducer';
import dialogsReducer from './dialogsReducer';

const mainReducer = combineReducers({
  urlRequests: urlRequestsReducer,
  auth: authReducer,
  dialogs: dialogsReducer,
  users: usersReducer,
  subscriberOrgs: subscriberOrgsReducer,
  subscribers: subscribersReducer,
  teams: teamsReducer,
  teamMembers: teamMembersReducer,
  teamRooms: teamRoomsReducer,
  teamRoomMembers: teamRoomMembersReducer,
  conversations: conversationsReducer,
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
