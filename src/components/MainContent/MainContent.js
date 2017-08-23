import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Chat from '../../containers/Chat';
import OrganizationPage from '../../containers/OrganizationPage';
import IntegrationsPage from '../../containers/IntegrationsPage';
import TeamPage from '../../containers/TeamPage';
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
          <Route exact path={routesPaths.organization} component={OrganizationPage} />
          <Route exact path={routesPaths.team} component={TeamPage} />
          <Route exact path={routesPaths.teamRoom} component={TeamRoomPage} />
          <Route exact path={routesPaths.member} component={TeamMemberPage} />
        </Switch>
      </div>
    </Content>
  );
}

export default MainContent;
