import { connect } from 'react-redux';

import { Onboarding } from 'src/components';
import { getCurrentUser, getPrimaryTeam, getUserRoles } from 'src/selectors';
import { updateUser } from 'src/actions';

const mapStateToProps = state => {
  const userRoles = getUserRoles(state);
  return {
    user: getCurrentUser(state),
    team: getPrimaryTeam(state),
    isAdmin: Boolean(userRoles.admin)
  };
};

const mapDispatchToProps = { updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding);
