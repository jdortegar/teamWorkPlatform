import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ChatContent from '../../components/ChatContent';

function mapStateToProps(state) {
  return {
    invitation: state.invitations.invitation
  };
}

export default withRouter(connect(mapStateToProps)(ChatContent));
