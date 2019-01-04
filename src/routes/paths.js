// eslint-disable-next-line import/prefer-default-export
export const paths = {
  // register: '/register/:email',
  // verifyAccount: '/verifyAccount/:uuid',
  createAccount: '/createAccount',
  recoverPassword: '/recoverPassword',
  setNewPassword: '/setNewPassword/:uuid',
  login: '/login',
  logout: '/logout',
  home: '/',
  app: '/app',
  chat: '/app/chat/:teamId',
  editUser: '/app/editUser/:userId',
  acceptInvitation: '/app/acceptinvitation/:type/:id',
  integrations: '/app/integrations/:subscriberOrgId',
  integration: '/app/integrations/:subscriberOrgId/:source/:status?',
  newTeam: '/app/createTeam/:subscriberOrgId',
  inviteNewMember: '/app/inviteNewMember/:subscriberOrgId',
  inviteToTeam: '/app/inviteToTeam/:teamId',
  team: '/app/team/:teamId',
  manageTeam: '/app/team/manage/:teamId/:status?',
  editTeam: '/app/editTeam/:teamId',
  editTeamMember: '/app/editTeamMember/:userId',
  teamIntegrations: '/app/teamIntegrations/:teamId',
  teamIntegration: '/app/teamIntegrations/:teamId/:source/:status?',
  member: '/app/teamMember/:teamMemberId',
  notifications: '/app/notifications',
  bookmarks: '/app/bookmarks/:subscriberOrgId',
  dashboard: '/app/dashboard/:reportId?',
  search: '/app/search',
  ckg: '/app/ckg/:subscriberOrgId',
  // Admin Organization
  organization: '/app/organization/:subscriberOrgId/:status?',
  organizationManage: '/app/editOrganization/manage/:subscriberOrgId',
  editOrganization: '/app/editOrganization/:subscriberOrgId',
  organizationManageTeams: '/app/editOrganization/:subscriberOrgId/teams',
  organizationManageMembers: '/app/editOrganization/:subscriberOrgId/members',
  organizationDataIntegrations: '/app/editOrganization/:subscriberOrgId/dataIntegrations'
};
