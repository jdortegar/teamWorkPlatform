import { connect } from 'react-redux';
import Notification from '../../components/Notification';
import { updateInvitation } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    updateInvitation: invitation => dispatch(updateInvitation(invitation))
  };
}

export default connect(null, mapDispatchToProps)(Notification);
