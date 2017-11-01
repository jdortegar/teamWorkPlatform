import { connect } from 'react-redux';
import InviteNewMemberPage from '../../pages/InviteNewMemberPage';
import { inviteNewSubscribers } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    inviteNewSubscribers: (users, subscriberOrgId) => dispatch(inviteNewSubscribers(users, subscriberOrgId))
  };
}

export default connect(null, mapDispatchToProps)(InviteNewMemberPage);
