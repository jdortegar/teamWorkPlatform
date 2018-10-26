import conversationsReducer from './conversationsReducer';
import dashboardReducer from './dashboardReducer';
import filesReducer from './filesReducer';
import integrationsReducer from './integrationsReducer';
import invitationsReducer from './invitationsReducer';
import presencesReducer from './presencesReducer';
import readMessagesReducer from './readMessagesReducer';
import searchReducer from './searchReducer';
import sentInvitationsReducer from './sentInvitationsReducer';
import sharingSettingsReducer from './sharingSettingsReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import subscribersReducer from './subscribersReducer';
import surveysReducer from './surveysReducer';
import teamMembersReducer from './teamMembersReducer';
import teamsReducer from './teamsReducer';
import typingsReducer from './typingsReducer';
import urlRequestsReducer from './urlRequestsReducer';
import usersReducer from './usersReducer';

const reducers = {
  conversations: conversationsReducer,
  dashboard: dashboardReducer,
  files: filesReducer,
  integrations: integrationsReducer,
  invitations: invitationsReducer,
  presences: presencesReducer,
  readMessages: readMessagesReducer,
  search: searchReducer,
  sentInvitations: sentInvitationsReducer,
  sharingSettings: sharingSettingsReducer,
  subscriberOrgs: subscriberOrgsReducer,
  subscribers: subscribersReducer,
  surveys: surveysReducer,
  teamMembers: teamMembersReducer,
  teams: teamsReducer,
  typings: typingsReducer,
  urlRequests: urlRequestsReducer,
  users: usersReducer
};

export default reducers;
