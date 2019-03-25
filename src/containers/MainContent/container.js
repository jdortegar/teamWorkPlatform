import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { notifyMessage, updateInvitationDeclined, fetchTeamsBySubscriberOrgId, fetchSubscriberOrgs } from 'src/actions';
import {
  getCurrentUserId,
  getInvitations,
  getDeclinedInvitations,
  getUserByUserId,
  getTeamsById,
  getCurrentUser
} from 'src/selectors';
import { MainContent } from 'src/components';

const mapStateToProps = state => ({
  declinedInvitations: getDeclinedInvitations(state),
  invitation: getInvitations(state),
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
  fetchTeamsBySubscriberOrgId,
  fetchSubscriberOrgs
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
