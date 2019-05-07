import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  notifyMessage,
  updateInvitationDeclined,
  updateRequestResponse,
  fetchTeamsBySubscriberOrgId,
  fetchSubscriberOrgs,
  fetchPublicTeams
} from 'src/actions';
import {
  getCurrentUserId,
  getInvitations,
  getRequests,
  getDeclinedInvitations,
  getResponseRequests,
  getUserByUserId,
  getTeamsById,
  getCurrentUser
} from 'src/selectors';
import { MainContent } from 'src/components';

const mapStateToProps = state => ({
  declinedInvitations: getDeclinedInvitations(state),
  responseRequest: getResponseRequests(state),
  invitation: getInvitations(state),
  requests: getRequests(state),
  pushMessage: state.notifications.pushMessage,
  users: getUserByUserId(state),
  currentUserId: getCurrentUserId(state),
  subscriberOrgs: state.subscriberOrgs,
  teams: getTeamsById(state),
  user: getCurrentUser(state)
});

const mapDispatchToProps = {
  notifyMessage,
  updateInvitationDeclined,
  updateRequestResponse,
  fetchTeamsBySubscriberOrgId,
  fetchSubscriberOrgs,
  fetchPublicTeams
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
