import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import _ from 'lodash';
import { ProtectedRoute, PublicRoute } from 'routing';
import Main from 'containers/Main';
import Login from 'containers/Login';
import SignUp from 'layouts/SignUp';

export const routesPaths = {
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
  organization: '/app/organization/:subscriberOrgId/:status?',
  newTeam: '/app/createTeam/:subscriberOrgId',
  inviteNewMember: '/app/inviteNewMember/:subscriberOrgId',
  inviteToTeam: '/app/inviteToTeam/:teamId',
  inviteToTeamRoom: '/app/inviteToTeamRoom/:teamRoomId',
  team: '/app/team/:teamId/:status?',
  editOrganization: '/app/editOrganization/:subscriberOrgId',
  editTeam: '/app/editTeam/:teamId',
  editTeamRoom: '/app/editTeamRoom/:teamRoomId',
  teamRoom: '/app/teamRoom/:teamRoomId',
  newTeamRoom: '/app/createTeamRoom/:teamId',
  member: '/app/teamMember/:teamMemberId',
  notifications: '/app/notifications',
  search: '/app/search',
  ckg: '/app/ckg/:subscriberOrgId'
};

export default (
  <Switch>
    <Redirect exact from={routesPaths.home} to={routesPaths.app} />
    <Route exact path={routesPaths.register} component={SignUp} />
    <Route exact path={routesPaths.verifyAccount} component={SignUp} />
    <Route exact path={routesPaths.setNewPassword} component={SignUp} />
    <Route exact path={routesPaths.createAccount} component={SignUp} />
    <PublicRoute path={routesPaths.login} component={Login} />
    <PublicRoute path={routesPaths.recoverPassword} component={SignUp} />
    <ProtectedRoute component={Main} />
  </Switch>
);

export const extractQueryParams = (props) => {
  const { search } = props.location;
  if ((search) && (search.length > 0)) {
    const searchParams = new URLSearchParams(search.slice(1));
    return searchParams ? _.fromPairs(Array.from(searchParams.entries())) : {};
  }
  return {};
};
