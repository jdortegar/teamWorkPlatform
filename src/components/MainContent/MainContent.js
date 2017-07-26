import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Chat from '../../containers/Chat';
import { routesPaths } from '../../routes';

const { Content } = Layout;

function MainContent() {
  return (
    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
      <Switch>
        <Route exact path={routesPaths.chat} component={Chat} />
      </Switch>
    </Content>
  );
}

export default MainContent;
