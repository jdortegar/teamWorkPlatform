import { connect } from 'react-redux';

import { PersonalizeTeamModal } from 'src/components';
import { getPrimaryTeam, getCurrentSubscriberOrgId, getFirstTeam } from 'src/selectors';
import { updateTeam } from 'src/actions';

const mapStateToProps = state => {
  let team = getPrimaryTeam(state);
  if (!team) team = getFirstTeam(state);

  return {
    team,
    orgId: getCurrentSubscriberOrgId(state)
  };
};

const mapDispatchToProps = {
  updateTeam
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalizeTeamModal);
