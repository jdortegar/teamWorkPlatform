import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import FileDrop from 'react-file-drop';
import TeamRoomPage from '../../containers/TeamRoomPage';
import { routesPaths } from '../../routes';

const { Content } = Layout;

function ChatContent() {
  return (
    <FileDrop onDrop={() => alert()} frame={document} targetAlwaysVisible>
      <Content style={{ background: '#fff', margin: 0, minHeight: '100vh' }}>
        <div>
          <Switch>
            <Route exact path={routesPaths.teamRoom} component={TeamRoomPage} />
          </Switch>
        </div>
      </Content>
    </FileDrop>
  );
}

export default ChatContent;
