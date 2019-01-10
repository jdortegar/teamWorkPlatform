import { connect } from 'react-redux';

import { InviteTeamMembersModal } from 'src/components';
import { getCurrentSubscriberOrgId } from 'src/selectors';
import { inviteNewSubscribers } from 'src/actions';

const mapStateToProps = state => ({
  orgId: getCurrentSubscriberOrgId(state)
});

const mapDispatchToProps = {
  inviteNewSubscribers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteTeamMembersModal);
