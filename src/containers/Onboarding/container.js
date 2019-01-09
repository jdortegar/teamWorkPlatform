import { connect } from 'react-redux';

import { Onboarding } from 'src/components';
import { getCurrentUser, getPrimaryTeam, getUserRoles } from 'src/selectors';
import { updateUser } from 'src/actions';

const mapStateToProps = state => ({
  user: getCurrentUser(state),
  team: getPrimaryTeam(state),
  userRoles: getUserRoles(state)
});

const mapDispatchToProps = { updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding);
