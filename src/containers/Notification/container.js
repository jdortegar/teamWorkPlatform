import { connect } from 'react-redux';
import { updateInvitation, invitationResponse } from 'src/actions';
import { Notification } from 'src/components';

function mapDispatchToProps(dispatch) {
  return {
    updateInvitation: invitation => dispatch(updateInvitation(invitation)),
    invitationResponse: (invitation, type) => dispatch(invitationResponse(invitation, type))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Notification);
