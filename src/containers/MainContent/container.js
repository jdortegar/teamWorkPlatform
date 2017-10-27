import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MainContent from '../../components/MainContent';
import { notifyMessage } from '../../actions';

function mapStateToProps(state) {
  return {
    invitation: state.invitations.invitation,
    pushMessage: state.notifications.pushMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    notifyMessage: () => dispatch(notifyMessage(null))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
