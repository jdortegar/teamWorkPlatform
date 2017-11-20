import { connect } from 'react-redux';
import Notification from '../../components/Notification';
import { updateInvitation, invitationResponse } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    updateInvitation: invitation => dispatch(updateInvitation(invitation)),
    invitationResponse: (invitation, type) => dispatch(invitationResponse(invitation, type))
  };
}

export default connect(null, mapDispatchToProps)(Notification);
