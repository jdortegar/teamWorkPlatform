import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Chat from '../../containers/Chat';
import Integrations from '../../containers/Integrations';
import OrganizationPage from '../../containers/OrganizationPage';
import TeamPage from '../../containers/TeamPage';
import TeamRoomPage from '../../containers/TeamRoomPage';
import { routesPaths } from '../../routes';

const { Content } = Layout;

function MainContent() {
  return (
    <Content style={{ background: '#fff', margin: 0, minHeight: 280 }}>
      <Switch>
        <Route exact path={routesPaths.chat} component={Chat} />
        <Route exact path={routesPaths.integrations} component={Integrations} />
        <Route exact path={routesPaths.organization} component={OrganizationPage} />
        <Route exact path={routesPaths.team} component={TeamPage} />
        <Route exact path={routesPaths.teamRoom} component={TeamRoomPage} />
      </Switch>
    </Content>
  );
}

export default MainContent;
