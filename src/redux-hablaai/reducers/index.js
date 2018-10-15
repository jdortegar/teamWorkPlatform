import urlRequestsReducer from './urlRequestsReducer';
import usersReducer from './usersReducer';
import presencesReducer from './presencesReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import subscribersReducer from './subscribersReducer';
import surveysReducer from './surveysReducer';
import teamsReducer from './teamsReducer';
import teamMembersReducer from './teamMembersReducer';
import invitationsReducer from './invitationsReducer';
import sentInvitationsReducer from './sentInvitationsReducer';
import conversationsReducer from './conversationsReducer';
import readMessagesReducer from './readMessagesReducer';
import searchReducer from './searchReducer';
import typingsReducer from './typingsReducer';
import filesReducer from './filesReducer';
import integrationsReducer from './integrationsReducer';
import dashboardReducer from './dashboardReducer';

const reducers = {
  urlRequests: urlRequestsReducer,
  users: usersReducer,
  presences: presencesReducer,
  subscriberOrgs: subscriberOrgsReducer,
  subscribers: subscribersReducer,
  teams: teamsReducer,
  teamMembers: teamMembersReducer,
  invitations: invitationsReducer,
  sentInvitations: sentInvitationsReducer,
  conversations: conversationsReducer,
  readMessages: readMessagesReducer,
  surveys: surveysReducer,
  search: searchReducer,
  typings: typingsReducer,
  files: filesReducer,
  integrations: integrationsReducer,
  dashboard: dashboardReducer
};

export default reducers;
