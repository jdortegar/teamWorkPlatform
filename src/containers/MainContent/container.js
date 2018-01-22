import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MainContent from '../../components/MainContent';
import { notifyMessage, updateInvitationDeclined } from '../../actions';
import { getMyselfUserId, getInvitations, getDeclinedInvitations, getUserByUserId } from '../../selectors';

function mapStateToProps(state) {
  return {
    declinedInvitations: getDeclinedInvitations(state),
    invitation: getInvitations(state),
    pushMessage: state.notifications.pushMessage,
    users: getUserByUserId(state),
    currentUserId: getMyselfUserId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    notifyMessage: () => dispatch(notifyMessage(null)),
    updateInvitationDeclined: () => dispatch(updateInvitationDeclined())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
