import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { notifyMessage, updateInvitationDeclined } from 'src/actions';
import { getCurrentUserId, getInvitations, getDeclinedInvitations, getUserByUserId } from 'src/selectors';
import { MainContent } from 'src/components';

function mapStateToProps(state) {
  return {
    declinedInvitations: getDeclinedInvitations(state),
    invitation: getInvitations(state),
    pushMessage: state.notifications.pushMessage,
    users: getUserByUserId(state),
    currentUserId: getCurrentUserId(state),
    subscriberOrgs: state.subscriberOrgs,
    teams: state.teams,
    teamRooms: state.teamRooms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    notifyMessage: () => dispatch(notifyMessage(null)),
    updateInvitationDeclined: () => dispatch(updateInvitationDeclined())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainContent)
);
