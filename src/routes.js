import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import _ from 'lodash';
import { ProtectedRoute, PublicRoute } from './routing';
import Main from './layouts/Main';
import SignUp from './layouts/SignUp';

export const routesPaths = {
  register: '/register',
  verifyAccount: '/verifyAccount/:uuid',
  createAccount: '/createAccount',
  login: '/login',
  logout: '/logout',
  home: '/',
  app: '/app',
  chat: '/app/chat/:conversationId',
  integrations: '/app/integrations/:subscriberOrgId',
  integrationDetails: '/app/integrations/:subscriberOrgId/:integrationDetails',
  organization: '/app/organization/:subscriberOrgId/:status?',
  newTeam: '/app/createTeam/:subscriberOrgId',
  inviteNewMember: '/app/inviteNewMember/:subscriberOrgId',
  team: '/app/team/:teamId',
  editTeam: '/app/editTeam/:teamId',
  teamRoom: '/app/teamRoom/:teamRoomId',
  newTeamRoom: '/app/createTeamRoom/:teamId',
  member: '/app/teamMember/:teamMemberId'
};

export default (
  <Switch>
    <Redirect exact from={routesPaths.home} to={routesPaths.app} />
    <Route exact path={routesPaths.register} component={SignUp} />
    <Route exact path={routesPaths.verifyAccount} component={SignUp} />
    <Route exact path={routesPaths.createAccount} component={SignUp} />
    <PublicRoute exact path={routesPaths.login} component={SignUp} />
    <ProtectedRoute component={Main} />
  </Switch>
);

export function extractQueryParams(props) {
  const { search } = props.location;
  if ((search) && (search.length > 0)) {
    const searchParams = new URLSearchParams(search.slice(1));
    return searchParams ? _.fromPairs(Array.from(searchParams.entries())) : {};
  }
  return {};
}
