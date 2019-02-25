import React, { Component } from 'react';
import { Layout, notification } from 'antd';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { paths } from 'src/routes';
import { sound1, soundNotification } from 'src/sounds';
import String from 'src/translations';
import { sortByLastCreatedFirst } from 'src/redux-hablaai/selectors/helpers';
import {
  HomePage,
  CKGPage,
  DirectMessagesPage,
  IntegrationsPage,
  OrgIntegrationPage,
  TeamManagePage,
  TeamPage,
  NewTeamPage,
  EditTeamPage,
  EditTeamMemberPage,
  InviteNewMemberPage,
  TeamMemberPage,
  TeamIntegrationsPage,
  TeamIntegrationPage,
  Notification,
  BookmarksPage,
  InviteToTeamPage,
  EditUserPage,
  DashboardPage,
  NotificationsPage,
  SurveyReportPage,
  SurveySettingsPage,
  AcceptInvitationPage,
  OrganizationPage,
  OrganizationManage,
  OrganizationManageTeams,
  OrganizationManageMembers,
  OrganizationDataIntegrations,
  EditOrganizationPage
} from 'src/containers';
import './styles/style.css';
import { Spinner } from 'src/components';

const { Content } = Layout;

const propTypes = {
  invitation: PropTypes.array,
  declinedInvitations: PropTypes.object,
  pushMessage: PropTypes.array,
  users: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  notifyMessage: PropTypes.func.isRequired,
  updateInvitationDeclined: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  fetchTeamsBySubscriberOrgId: PropTypes.func.isRequired
};

const defaultProps = {
  pushMessage: null,
  declinedInvitations: null,
  invitation: []
};

function invitationKey(inv) {
  const { teamId, subscriberOrgId } = inv;
  return teamId ? `team-${teamId}` : `org-${subscriberOrgId}`;
}

class MainContent extends Component {
  state = {
    teamsLoaded: null
  };

  componentDidMount() {
    if (this.props.pushMessage && this.props.pushMessage.length > 0) {
      const text = this.props.pushMessage[0].content.reduce(
        (prevVal, content) => (prevVal || content.type === 'text/plain' ? content.text : undefined),
        undefined
      );
      const args = {
        message: String.t('MainContent.newMessage'),
        description: text,
        duration: 4,
        onClose: () => {
          this.props.notifyMessage();
        }
      };
      notification.open(args);
      const audio = new Audio(soundNotification);
      audio.play();
    }

    this.props.fetchTeamsBySubscriberOrgId().then(() => {
      this.setState({ teamsLoaded: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    const invitations = nextProps.invitation ? this.getValidInvites(nextProps.invitation) : [];
    if (invitations.length > this.props.invitation) {
      const audio = new Audio(sound1);
      audio.play();
    }

    if (nextProps.declinedInvitations) {
      let text = '';
      const invitation = nextProps.declinedInvitations;
      if (invitation.teamName) {
        const { firstName, lastName } = this.props.users[invitation.inviteeUserIdOrEmail];
        text = String.t('MainContent.declinedTeam', { firstName, lastName, teamName: invitation.teamName });
      } else {
        text = String.t('MainContent.declinedOrg', {
          inviteeUserIdOrEmail: invitation.inviteeUserIdOrEmail,
          subscriberOrgName: invitation.subscriberOrgName
        });
      }
      const args = {
        message: text,
        duration: 5,
        onClose: () => {
          this.props.updateInvitationDeclined();
        }
      };
      notification.open(args);
      const audio = new Audio(soundNotification);
      audio.play();
    }

    if (nextProps.pushMessage && nextProps.pushMessage.length > 0) {
      if (this.props.pushMessage) {
        notification.destroy();
      }
      const msg = nextProps.pushMessage[0];
      const { createdBy, content } = msg;
      if (msg.createdBy !== this.props.currentUserId) {
        const user = this.props.users[createdBy];
        if (user) {
          const args = {
            message: String.t('MainContent.newMessageFrom', user),
            description: content[0].text,
            duration: 4,
            onClose: () => {
              this.props.notifyMessage();
            }
          };
          notification.open(args);
          const audio = new Audio(soundNotification);
          audio.play();
        }
      }
    }
  }

  getValidInvites() {
    const { teams, subscriberOrgs } = this.props;
    const { currentSubscriberOrgId, subscriberOrgById } = subscriberOrgs;
    if (!subscriberOrgById[currentSubscriberOrgId]) {
      // data not available yet
      return [];
    }
    let { invitation } = this.props;
    if (invitation.length > 0) {
      const invitationsByKey = {};
      invitation = invitation.sort(sortByLastCreatedFirst).filter(inv => {
        // if already a member of the org or team, don't include the invite
        const { teamId } = inv;
        if (teamId && teams[teamId]) {
          return false;
        }

        // build map of invitations to make sure same invite isn't repeated
        const key = invitationKey(inv);
        if (!invitationsByKey[key]) {
          invitationsByKey[key] = true;
          return true;
        }
        return false;
      });

      // now put the array in chronological order again
      invitation = _.reverse(invitation);
    }
    return invitation;
  }

  render() {
    const invitation = this.getValidInvites();

    if (!this.state.teamsLoaded) {
      return <Spinner />;
    }
    return (
      <Content className="MainContent__layout-wrapper">
        {invitation.length > 0 ? invitation.map(inv => <Notification key={invitationKey(inv)} options={inv} />) : null}
        <Switch>
          <Route exact path={paths.app} component={HomePage} />
          <Route exact path={paths.integrations} component={IntegrationsPage} />
          <Route exact path={paths.integration} component={OrgIntegrationPage} />
          <Route exact path={paths.team} component={TeamPage} />
          <Route exact path={paths.manageTeam} component={TeamManagePage} />
          <Route exact path={paths.newTeam} component={NewTeamPage} />
          <Route exact path={paths.editTeam} component={EditTeamPage} />
          <Route exact path={paths.editTeamMember} component={EditTeamMemberPage} />
          <Route exact path={paths.editUser} component={EditUserPage} />
          <Route exact path={paths.inviteNewMember} component={InviteNewMemberPage} />
          <Route exact path={paths.inviteToTeam} component={InviteToTeamPage} />
          <Route exact path={paths.member} component={TeamMemberPage} />
          <Route exact path={paths.teamIntegrations} component={TeamIntegrationsPage} />
          <Route exact path={paths.teamIntegration} component={TeamIntegrationPage} />
          <Route exact path={paths.acceptInvitation} component={AcceptInvitationPage} />
          <Route exact path={paths.ckg} component={CKGPage} />
          <Route exact path={paths.dashboard} component={DashboardPage} />
          <Route exact path={paths.notifications} component={NotificationsPage} />
          <Route exact path={paths.surveyReport} component={SurveyReportPage} />
          <Route exact path={paths.surveySettings} component={SurveySettingsPage} />
          <Route exact path={paths.bookmarks} component={BookmarksPage} />
          <Route exact path={paths.organization} component={OrganizationPage} />
          <Route exact path={paths.organizationManage} component={OrganizationManage} />
          <Route exact path={paths.editOrganization} component={EditOrganizationPage} />
          <Route exact path={paths.organizationManageTeams} component={OrganizationManageTeams} />
          <Route exact path={paths.organizationManageMembers} component={OrganizationManageMembers} />
          <Route exact path={paths.organizationDataIntegrations} component={OrganizationDataIntegrations} />
          <Route exact path={paths.chat} component={DirectMessagesPage} />
        </Switch>
      </Content>
    );
  }
}

MainContent.propTypes = propTypes;
MainContent.defaultProps = defaultProps;

export default MainContent;
