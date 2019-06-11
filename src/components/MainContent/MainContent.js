import React, { Component } from 'react';
import { Layout, notification } from 'antd';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { paths } from 'src/routes';
import { soundNotificationPTAudio, soundNotificationInvitationAudio } from 'src/sounds';
import { notificationIcon } from 'src/img';
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
  RequestNotification,
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
  requests: PropTypes.array,
  declinedInvitations: PropTypes.object,
  responseRequest: PropTypes.object,
  pushMessage: PropTypes.object,
  users: PropTypes.object.isRequired,
  notifyMessage: PropTypes.func.isRequired,
  updateInvitationDeclined: PropTypes.func.isRequired,
  updateRequestResponse: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  teamMembersByTeamId: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  fetchTeamsBySubscriberOrgId: PropTypes.func.isRequired,
  fetchPublicTeams: PropTypes.func.isRequired,
  user: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const defaultProps = {
  pushMessage: null,
  declinedInvitations: null,
  responseRequest: null,
  invitation: [],
  requests: [],
  user: {}
};

const soundNotificationPT = new Audio(soundNotificationPTAudio);
const soundNotificationInvitation = new Audio(soundNotificationInvitationAudio);

function invitationKey(inv) {
  const { teamId, subscriberOrgId } = inv;
  return teamId ? `team-${teamId}` : `org-${subscriberOrgId}`;
}

const MENTION_VALIDATION = /\[id\].*?\[\/id\]/gm;

class MainContent extends Component {
  state = {
    teamsLoaded: null
  };

  componentDidMount() {
    const { subscriberOrgs, pushMessage } = this.props;
    const { currentSubscriberOrgId } = subscriberOrgs;
    const { muteNotifications } = this.props.user.preferences;

    this.displayPushMessage(pushMessage, muteNotifications);

    this.props.fetchTeamsBySubscriberOrgId().then(() => {
      this.props.fetchPublicTeams(currentSubscriberOrgId);
      this.setState({ teamsLoaded: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    const invitations = nextProps.invitation ? this.getValidInvites(nextProps.invitation) : [];
    const { muteNotifications } = this.props.user.preferences;
    if (invitations.length > this.props.invitation) {
      if (moment().diff(muteNotifications || 0, 'minutes') > 0) {
        soundNotificationInvitation.play();
      }
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
        icon: (
          <div className={`notification-edition ${text.length > 35 ? '' : 'translate-10'}`}>
            <img src={notificationIcon} className="notification__Image" alt={String.t('altNotification')} />
          </div>
        ),
        message: text,
        duration: 3,
        onClose: () => {
          this.props.updateInvitationDeclined();
        }
      };
      notification.open(args);
    }

    if (nextProps.responseRequest) {
      // Notification for accept/decline request to join Team.
      const request = nextProps.responseRequest;
      const response = request.accepted ? 'accepted' : 'declined';
      const { fullName } = this.props.users[request.teamAdminId];
      const { name } = this.props.teams[request.teamId];
      const text = String.t('MainContent.responseRequest', { fullName, response, teamName: name });

      const args = {
        icon: (
          <div className={`notification-edition ${text.length > 35 ? '' : 'translate-10'}`}>
            <img src={notificationIcon} className="notification__Image" alt={String.t('altNotification')} />
          </div>
        ),
        message: text,
        duration: 5,
        onClose: () => {
          this.props.updateRequestResponse();
        }
      };
      notification.open(args);
    }

    this.displayPushMessage(nextProps.pushMessage, muteNotifications, this.props.pushMessage);
  }

  getValidInvites() {
    const { subscriberOrgs, teamMembersByTeamId, user } = this.props;
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
        if (teamMembersByTeamId[teamId] && teamMembersByTeamId[teamId].includes(user.userId)) {
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

  displayPushMessage = (pushMessage, muteNotifications, priorMessage = null) => {
    // avoid rendering the same notification
    if (!pushMessage || (priorMessage && priorMessage.key === pushMessage.key)) return;

    let textMessage = pushMessage.description;

    const taggedUsers = textMessage.match(MENTION_VALIDATION);
    if (taggedUsers) {
      const textArray = _.isArray(textMessage) ? textMessage : textMessage.split(':');
      textMessage = textArray.map(str => {
        if (str.match(MENTION_VALIDATION)) {
          const tagId = str.replace(/\[id\]|\[\/id\]/gm, '');
          const tagUser = Object.values(this.props.users).find(userEl => userEl.userId === tagId);

          // Notification if user has been tagged
          if (tagId === this.props.user.userId) {
            const taggedconfig = {
              icon: (
                <div className="notification-edition translate-10">
                  <img src={notificationIcon} className="notification__Image" alt={String.t('altNotification')} />
                </div>
              ),
              message: String.t('userTagged'),
              duration: 3,
              onClose: () => this.props.notifyMessage(),
              onClick: () => this.props.history.push(pushMessage.link)
            };
            notification.open(taggedconfig);
          }
          return `@${tagUser.fullName}`;
        }
        return str;
      });
    }

    const config = {
      key: pushMessage.key, // key prevents duplicated messages
      icon: (
        <div className="notification-edition">
          <img src={notificationIcon} className="notification__Image" alt={String.t('altNotification')} />
        </div>
      ),
      message: String.t('MainContent.newMessageFrom', pushMessage.user),
      description: textMessage || String.t('MainContent.newMessage'),
      duration: 3,
      onClose: () => this.props.notifyMessage(),
      onClick: () => this.props.history.push(pushMessage.link)
    };
    notification.open(config);
    if (moment().diff(muteNotifications || 0, 'minutes') > 0) {
      soundNotificationPT.play();
    }
  };

  render() {
    const invitation = this.getValidInvites();
    const { requests } = this.props;

    if (!this.state.teamsLoaded) {
      return <Spinner />;
    }
    return (
      <Content className="MainContent__layout-wrapper">
        {invitation.length > 0 ? invitation.map(inv => <Notification key={invitationKey(inv)} options={inv} />) : null}
        {requests.length > 0
          ? requests.map(request => <RequestNotification key={request.requestId} request={request} />)
          : null}
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
