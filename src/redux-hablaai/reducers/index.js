import bookmarks from './bookmarksReducer';
import callings from './callingsReducer';
import conversations from './conversationsReducer';
import dashboard from './dashboardReducer';
import files from './filesReducer';
import integrations from './integrationsReducer';
import invitations from './invitationsReducer';
import messages from './messagesReducer';
import presences from './presencesReducer';
import schedules from './schedulesReducer';
import requests from './requestsReducer';
import search from './searchReducer';
import searchedChatMessages from './searchedChatMessagesReducer';
import searchedAttachedFiles from './searchedAttachedFilesReducer';
import searchedFiles from './searchedFilesReducer';
import sentInvitations from './sentInvitationsReducer';
import sharingSettings from './sharingSettingsReducer';
import subscriberOrgs from './subscriberOrgsReducer';
import subscribers from './subscribersReducer';
import subscription from './subscriptionReducer';
import surveys from './surveysReducer';
import teamMembers from './teamMembersReducer';
import teams from './teamsReducer';
import typings from './typingsReducer';
import ui from './uiReducer';
import unreadMessages from './unreadMessagesReducer';
import urlRequests from './urlRequestsReducer';
import users from './usersReducer';

const reducers = {
  bookmarks,
  callings,
  conversations,
  dashboard,
  files,
  integrations,
  invitations,
  messages,
  presences,
  requests,
  schedules,
  search,
  searchedChatMessages,
  searchedAttachedFiles,
  searchedFiles,
  sentInvitations,
  sharingSettings,
  subscriberOrgs,
  subscribers,
  subscription,
  surveys,
  teamMembers,
  teams,
  typings,
  ui,
  unreadMessages,
  urlRequests,
  users
};

export default reducers;
