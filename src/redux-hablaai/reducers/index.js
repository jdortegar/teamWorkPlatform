import urlRequestsReducer from './urlRequestsReducer';
import usersReducer from './usersReducer';
import presencesReducer from './presencesReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import subscribersReducer from './subscribersReducer';
import teamsReducer from './teamsReducer';
import teamMembersReducer from './teamMembersReducer';
import teamRoomsReducer from './teamRoomsReducer';
import teamRoomMembersReducer from './teamRoomMembersReducer';
import invitationsReducer from './invitationsReducer';
import conversationsReducer from './conversationsReducer';
import readMessagesReducer from './readMessagesReducer';
import typingsReducer from './typingsReducer';
import timeActivitiesReducer from './timeActivitiesReducer';
import integrationsReducer from './integrationsReducer';

const reducers = {
  urlRequests: urlRequestsReducer,
  users: usersReducer,
  presences: presencesReducer,
  subscriberOrgs: subscriberOrgsReducer,
  subscribers: subscribersReducer,
  teams: teamsReducer,
  teamMembers: teamMembersReducer,
  teamRooms: teamRoomsReducer,
  teamRoomMembers: teamRoomMembersReducer,
  invitations: invitationsReducer,
  conversations: conversationsReducer,
  readMessages: readMessagesReducer,
  typings: typingsReducer,
  timeActivities: timeActivitiesReducer,
  integrations: integrationsReducer
};

export default reducers;
