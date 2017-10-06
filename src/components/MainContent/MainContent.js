import React from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import OrganizationPage from '../../containers/OrganizationPage';
import IntegrationsPage from '../../containers/IntegrationsPage';
import IntegrationDetailsPage from '../../containers/IntegrationDetailsPage';
import TeamPage from '../../containers/TeamPage';
import NewTeamPage from '../../containers/NewTeamPage';
import EditTeamPage from '../../containers/EditTeamPage';
import NewTeamRoomPage from '../../containers/NewTeamRoomPage';
import InviteNewMemberPage from '../../containers/InviteNewMemberPage';
import TeamRoomPage from '../../containers/TeamRoomPage';
import TeamMemberPage from '../../containers/TeamMemberPage';
import Notification from '../../components/Notification';
import InviteToTeamPage from '../../containers/InviteToTeamPage';
import CKGPage from '../../pages/CKGPage';
import NotificationsPage from '../../pages/NotificationsPage';
import { routesPaths } from '../../routes';

const { Content } = Layout;

const propTypes = {
  invitation: PropTypes.array.isRequired
};

function MainContent(props) {
  const { invitation } = props;
  return (
    <Content style={{ background: '#fff', margin: 0, minHeight: '100vh' }}>
      <div>
        {
          invitation.length > 0 ? invitation.map(el => <Notification options={el} />) : null
        }
        <Switch>
          <Route exact path={routesPaths.integrations} component={IntegrationsPage} />
          <Route exact path={routesPaths.integrationDetails} component={IntegrationDetailsPage} />
          <Route exact path={routesPaths.organization} component={OrganizationPage} />
          <Route exact path={routesPaths.team} component={TeamPage} />
          <Route exact path={routesPaths.newTeamRoom} component={NewTeamRoomPage} />
          <Route exact path={routesPaths.newTeam} component={NewTeamPage} />
          <Route exact path={routesPaths.editTeam} component={EditTeamPage} />
          <Route exact path={routesPaths.inviteNewMember} component={InviteNewMemberPage} />
          <Route exact path={routesPaths.inviteToTeam} component={InviteToTeamPage} />
          <Route exact path={routesPaths.teamRoom} component={TeamRoomPage} />
          <Route exact path={routesPaths.member} component={TeamMemberPage} />
          <Route exact path={routesPaths.ckg} component={CKGPage} />
          <Route exact path={routesPaths.notifications} component={NotificationsPage} />
        </Switch>
      </div>
    </Content>
  );
}

MainContent.propTypes = propTypes;

export default MainContent;
