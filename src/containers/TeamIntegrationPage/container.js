import { connect } from 'react-redux';
import { withStatusMessage } from 'src/hoc';
import { TeamIntegrationPage } from 'src/pages';
import {
  getTeam,
  getTeamIntegration,
  getTeamIntegrationContent,
  getTeamSharingSettings,
  getCurrentSubscriberUserId
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
  const { folders, files, saved, submitting } = getTeamSharingSettings(state, { source, teamId });

  return {
    team: getTeam(state, teamId),
    integration: getTeamIntegration(state, { source, teamId }),
    content: getTeamIntegrationContent(state, { source, subscriberUserId, teamId }),
    selectedFolders: folders,
    selectedFiles: files,
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
  revokeTeamIntegration
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStatusMessage(TeamIntegrationPage));
