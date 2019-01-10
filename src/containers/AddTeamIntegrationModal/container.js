import { connect } from 'react-redux';

import { AddTeamIntegrationModal } from 'src/components';
import { getPrimaryTeam } from 'src/selectors';

const mapStateToProps = state => ({
  team: getPrimaryTeam(state)
});

export default connect(mapStateToProps)(AddTeamIntegrationModal);
