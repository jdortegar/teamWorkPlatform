import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MainContent from '../../components/MainContent';
import { notifyMessage } from '../../actions';
import { getInvitations, getDeclinedInvitations } from '../../selectors';

function mapStateToProps(state) {
  return {
    declinedInvitations: getDeclinedInvitations(state),
    invitation: getInvitations(state),
    pushMessage: state.notifications.pushMessage
  };
}

function mapDispatchToProps(dispatch) {
  return {
    notifyMessage: () => dispatch(notifyMessage(null))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
