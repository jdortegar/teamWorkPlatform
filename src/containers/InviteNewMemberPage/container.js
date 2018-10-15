import { connect } from 'react-redux';
import { inviteNewSubscribers } from 'src/actions';
import { InviteNewMemberPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById
  };
}

const mapDispatchToProps = dispatch => ({
  inviteNewSubscribers: (users, subscriberOrgId) => dispatch(inviteNewSubscribers(users, subscriberOrgId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteNewMemberPage);
