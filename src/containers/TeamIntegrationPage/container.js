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
  isFetchingContent
} from 'src/selectors';
import {
  fetchTeamIntegrations,
  fetchIntegrationContent,
  saveTeamSharingSettings,
  toggleTeamSharingSettings,
  toggleAllTeamSharingSettings,
  integrateTeamIntegration,
  configureTeamIntegration,
  revokeTeamIntegration
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, source, status } = props.match.params;
  const subscriberUserId = getCurrentSubscriberUserId(state);
  const { folders, files, sites, saved, submitting } = getTeamSharingSettings(state, { source, teamId });

  return {
    team: getTeam(state, teamId),
    integration: getTeamIntegration(state, { source, teamId }),
    content: getTeamIntegrationContent(state, { source, subscriberUserId, teamId }),
    isFetchingContent: isFetchingContent(state),
    contentError: getContentError(state),
    selectedSettings: { folders, files, sites },
    isSubmittingSharingSettings: submitting,
    isSavedSharingSettings: saved,
    subscriberUserId,
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
  configureTeamIntegration,
  revokeTeamIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStatusMessage(TeamIntegrationPage));
