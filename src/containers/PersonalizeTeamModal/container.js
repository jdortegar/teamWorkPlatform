import { connect } from 'react-redux';

import { PersonalizeTeamModal } from 'src/components';
import { getPrimaryTeam, getCurrentSubscriberOrgId } from 'src/selectors';
import { updateTeam } from 'src/actions';

const mapStateToProps = state => ({
  team: getPrimaryTeam(state),
  orgId: getCurrentSubscriberOrgId(state)
});

const mapDispatchToProps = {
  updateTeam
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalizeTeamModal);
