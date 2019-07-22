import { connect } from 'react-redux';
import { withStatusMessage } from 'src/hoc';
import { TeamIntegrationPage } from 'src/pages';
import {
  getTeam,
  getTeamIntegration,
  getTeamIntegrationContent,
  getTeamSharingSettings,
  getCurrentSubscriberUserId,
  getContentError,
  isFetchingContent,
  getUserByUserId
} from 'src/selectors';
import {
  fetchTeamIntegrations,
  fetchIntegrationContent,
  saveTeamSharingSettings,
  toggleTeamSharingSettings,
  toggleAllTeamSharingSettings,
  integrateTeamIntegration,
  revokeTeamIntegration
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, source, status } = props.match.params;
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const { folders, files, sites, submitting } = getTeamSharingSettings(state, { source, teamId });
  const subscriberUsers = Object.values(getUserByUserId(state));
  const integration = getTeamIntegration(state, { source, teamId });
  const userEmail = (subscriberUsers.find(member => integration && integration.userId === member.userId) || {}).email;

  return {
    team: getTeam(state, teamId),
    integration,
    content: getTeamIntegrationContent(state, { source, subscriberUserId, teamId }),
    isFetchingContent: isFetchingContent(state),
    contentError: getContentError(state),
    selectedSettings: { folders, files, sites },
    isSubmittingSharingSettings: submitting,
    isSavedSharingSettings: false, // before was used saved property from getTeamSharingSettings
    subscriberUserId,
    userEmail,
    source,
    status
  };
};

const mapDispatchToProps = {
  fetchTeamIntegrations,
  fetchIntegrationContent,
  saveTeamSharingSettings,
  toggleTeamSharingSettings,
  toggleAllTeamSharingSettings,
  integrateTeamIntegration,
  revokeTeamIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStatusMessage(TeamIntegrationPage));
