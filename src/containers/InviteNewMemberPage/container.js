import { connect } from 'react-redux';
import InviteNewMemberPage from '../../pages/InviteNewMemberPage';
import { inviteNewMembers } from '../../actions';

function mapDispatchToProps(dispatch) {
  return {
    inviteNewMembers: (users, subscriberOrgId) => dispatch(inviteNewMembers(users, subscriberOrgId))
  };
}

export default connect(null, mapDispatchToProps)(InviteNewMemberPage);
