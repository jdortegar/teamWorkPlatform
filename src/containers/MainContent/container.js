import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MainContent from '../../components/MainContent';
import { notifyMessage } from '../../actions';
import { getInvitations } from '../../selectors';

function mapStateToProps(state) {
  return {
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
