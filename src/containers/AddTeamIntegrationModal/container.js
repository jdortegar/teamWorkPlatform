import { connect } from 'react-redux';

import { AddTeamIntegrationModal } from 'src/components';
import { getPrimaryTeam, getFirstTeam } from 'src/selectors';

const mapStateToProps = state => {
  let team = getPrimaryTeam(state);
  if (!team) team = getFirstTeam(state);

  return {
    team
  };
};

export default connect(mapStateToProps)(AddTeamIntegrationModal);
