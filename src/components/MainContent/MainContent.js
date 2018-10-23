import React, { Component } from 'react';
import { Layout, notification } from 'antd';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { paths } from 'src/routes';
import { sound1 } from 'src/sounds';
import String from 'src/translations';
import { sortByLastCreatedFirst } from 'src/redux-hablaai/selectors/helpers';
import {
  HomePage,
  ChatContent,
  IntegrationsPage,
  IntegrationDetailsPage,
  TeamManagePage,
  TeamPageV1,
  NewTeamPage,
  EditTeamPage,
  InviteNewMemberPage,
  TeamMemberPage,
  TeamIntegrationsPage,
  TeamIntegrationDetailsPage,
  Notification,
  BookmarksPage,
  InviteToTeamPage,
  EditUserPage,
  CKGPage,
  SearchPage,
  DashboardPage,
  NotificationsPage,
  AcceptInvitationPage,
  OrganizationPage,
  OrganizationManageTeams,
  OrganizationManageMembers,
  OrganizationDataIntegrations,
  EditOrganizationPage
} from 'src/containers';
import './styles/style.css';

const { Content } = Layout;

const propTypes = {
  invitation: PropTypes.array,
  declinedInvitations: PropTypes.object,
  pushMessage: PropTypes.object,
  users: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  notifyMessage: PropTypes.func.isRequired,
  updateInvitationDeclined: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.object.isRequired
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
    }
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
    }

    if (nextProps.pushMessage && nextProps.pushMessage.length > 0) {
      if (this.props.pushMessage) {
        notification.destroy();
      }
      const msg = nextProps.pushMessage[0];
      const { createdBy, text } = msg; // TODO: JC: It should be the content[type=text/plain].text
      if (msg.createdBy !== this.props.currentUserId) {
        const user = this.props.users[createdBy];
        if (user) {
          const args = {
            message: String.t('MainContent.newMessageFrom', user),
            description: text,
            duration: 4,
            onClose: () => {
              this.props.notifyMessage();
            }
          };
          notification.open(args);
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
    return (
      <Content className="MainContent__layout-wrapper">
        {invitation.length > 0 ? invitation.map(inv => <Notification key={invitationKey(inv)} options={inv} />) : null}
        <Switch>
          <Route exact path={paths.app} component={HomePage} />
          <Route exact path={paths.integrations} component={IntegrationsPage} />
          <Route exact path={paths.integrationDetails} component={IntegrationDetailsPage} />
          <Route exact path={paths.team} component={TeamPageV1} />
          <Route exact path={paths.manageTeam} component={TeamManagePage} />
          <Route exact path={paths.newTeam} component={NewTeamPage} />
          <Route exact path={paths.editTeam} component={EditTeamPage} />
          <Route exact path={paths.editUser} component={EditUserPage} />
          <Route exact path={paths.inviteNewMember} component={InviteNewMemberPage} />
          <Route exact path={paths.inviteToTeam} component={InviteToTeamPage} />
          <Route exact path={paths.teamRoom} component={ChatContent} />
          <Route exact path={paths.member} component={TeamMemberPage} />
          <Route exact path={paths.teamIntegrations} component={TeamIntegrationsPage} />
          <Route exact path={paths.teamintegrationDetails} component={TeamIntegrationDetailsPage} />
          <Route exact path={paths.acceptInvitation} component={AcceptInvitationPage} />
          <Route exact path={paths.ckg} component={CKGPage} />
          <Route exact path={paths.dashboard} component={DashboardPage} />
          <Route exact path={paths.search} component={SearchPage} />
          <Route exact path={paths.notifications} component={NotificationsPage} />
          <Route exact path={paths.bookmarks} component={BookmarksPage} />
          <Route exact path={paths.organization} component={OrganizationPage} />
          <Route exact path={paths.editOrganization} component={EditOrganizationPage} />
          <Route exact path={paths.organizationManageTeams} component={OrganizationManageTeams} />
          <Route exact path={paths.organizationManageMembers} component={OrganizationManageMembers} />
          <Route exact path={paths.organizationDataIntegrations} component={OrganizationDataIntegrations} />
        </Switch>
      </Content>
    );
  }
}

MainContent.propTypes = propTypes;
MainContent.defaultProps = defaultProps;

export default MainContent;
