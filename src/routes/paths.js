// eslint-disable-next-line import/prefer-default-export
export const paths = {
  register: '/register',
  verifyAccount: '/verifyAccount/:uuid',
  createAccount: '/createAccount',
  recoverPassword: '/recoverPassword',
  setNewPassword: '/setNewPassword/:uuid',
  login: '/login',
  logout: '/logout',
  home: '/',
  app: '/app',
  chat: '/app/chat/:conversationId',
  editUser: '/app/editUser',
  acceptInvitation: '/app/acceptinvitation/:type/:id',
  integrations: '/app/integrations/:subscriberOrgId',
  integrationDetails: '/app/integrations/:subscriberOrgId/:integrationDetails/:status?',
  newTeam: '/app/createTeam/:subscriberOrgId',
  inviteNewMember: '/app/inviteNewMember/:subscriberOrgId',
  inviteToTeam: '/app/inviteToTeam/:teamId',
  team: '/app/team/:teamId/',
  manageTeam: '/app/team/manage/:teamId/:status?',
  editTeam: '/app/editTeam/:teamId',
  teamRoom: '/app/teamRoom/:teamRoomId', // WILL BE REMOVED
  member: '/app/teamMember/:teamMemberId',
  notifications: '/app/notifications',
  bookmarks: '/app/bookmarks/:subscriberOrgId',
  dashboard: '/app/dashboard/:reportId?',
  search: '/app/search',
  ckg: '/app/ckg/:subscriberOrgId',
  // Admin Organization
  organization: '/app/organization/:subscriberOrgId/:status?',
  editOrganization: '/app/editOrganization/:subscriberOrgId',
  organizationManageTeams: '/app/editOrganization/:subscriberOrgId/teams',
  organizationManageMembers: '/app/editOrganization/:subscriberOrgId/members'
};
