import React, { Component } from 'react';
import { Layout, notification } from 'antd';
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
import Notification from '../../containers/Notification';
import InviteToTeamPage from '../../containers/InviteToTeamPage';
import CKGPage from '../../pages/CKGPage';
import NotificationsPage from '../../pages/NotificationsPage';
import AcceptInvitationPage from '../../pages/AcceptInvitationPage';
import { routesPaths } from '../../routes';
import { sound1 } from '../../sounds';
import './styles/style.css';

const { Content } = Layout;

const propTypes = {
  invitation: PropTypes.array.isRequired,
  pushMessage: PropTypes.object,
  notifyMessage: PropTypes.func.isRequired
};

const defaultProps = {
  pushMessage: null
};

class MainContent extends Component {
  componentDidMount() {
    if ((this.props.pushMessage) && (this.props.pushMessage.length > 0)) {
      const text = this.props.pushMessage[0].content.reduce((prevVal, content) => {
        return prevVal || (content.type === 'text/plain') ? content.text : undefined;
      }, undefined);
      const args = {
        message: 'New Message',
        description: text,
        duration: 4,
        onClose: () => {
          this.props.notifyMessage();
        }
      };
      notification.open(args);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.length > this.props.invitation) {
      const audio = new Audio(sound1);
      audio.play();
    }

    if (nextProps.pushMessage) {
      if (this.props.pushMessage) {
        notification.destroy();
      }
      const { text } = nextProps.pushMessage; // TODO: JC: It should be the content[type=text/plain].text
      const args = {
        message: 'New Message',
        description: text,
        duration: 4,
        onClose: () => {
          this.props.notifyMessage();
        }
      };
      notification.open(args);
    }
  }

  render() {
    const { invitation } = this.props;
    return (
      <Content className="layout-wrapper">
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
            <Route exact path={routesPaths.acceptInvitation} component={AcceptInvitationPage} />
            <Route exact path={routesPaths.ckg} component={CKGPage} />
            <Route exact path={routesPaths.notifications} component={NotificationsPage} />
          </Switch>
        </div>
      </Content>
    );
  }
}

MainContent.propTypes = propTypes;
MainContent.defaultProps = defaultProps;

export default MainContent;
