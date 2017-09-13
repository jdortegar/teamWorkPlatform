import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Chat from '../../containers/Chat';
import OrganizationPage from '../../containers/OrganizationPage';
import IntegrationsPage from '../../containers/IntegrationsPage';
import IntegrationDetailsPage from '../../containers/IntegrationDetailsPage';
import TeamPage from '../../containers/TeamPage';
import NewTeamPage from '../../containers/NewTeamPage';
import NewTeamRoomPage from '../../containers/NewTeamRoomPage';
import InviteNewMemberPage from '../../containers/InviteNewMemberPage';
import TeamRoomPage from '../../containers/TeamRoomPage';
import TeamMemberPage from '../../containers/TeamMemberPage';
import { routesPaths } from '../../routes';

const { Content } = Layout;

function MainContent() {
  return (
    <Content style={{ background: '#fff', margin: 0, minHeight: '100vh' }}>
      <div>
        <Switch>
          <Route exact path={routesPaths.chat} component={Chat} />
          <Route exact path={routesPaths.integrations} component={IntegrationsPage} />
          <Route exact path={routesPaths.integrationDetails} component={IntegrationDetailsPage} />
          <Route exact path={routesPaths.organization} component={OrganizationPage} />
          <Route exact path={routesPaths.team} component={TeamPage} />
          <Route exact path={routesPaths.newTeamRoom} component={NewTeamRoomPage} />
          <Route exact path={routesPaths.newTeam} component={NewTeamPage} />
          <Route exact path={routesPaths.inviteNewMember} component={InviteNewMemberPage} />
          <Route exact path={routesPaths.teamRoom} component={TeamRoomPage} />
          <Route exact path={routesPaths.member} component={TeamMemberPage} />
        </Switch>
      </div>
    </Content>
  );
}

export default MainContent;
