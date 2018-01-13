import { connect } from 'react-redux';
import InviteNewMemberPage from '../../pages/InviteNewMemberPage';
import { inviteNewSubscribers } from '../../actions';

function mapStateToProps(state) {
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById
  };
}

const mapDispatchToProps = dispatch => ({
  inviteNewSubscribers: (users, subscriberOrgId) => dispatch(inviteNewSubscribers(users, subscriberOrgId))
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteNewMemberPage);
