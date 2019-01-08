import { connect } from 'react-redux';

import { Onboarding } from 'src/components';
import { getCurrentUser } from 'src/selectors';
import { updateUser } from 'src/actions';

const mapStateToProps = state => ({
  user: getCurrentUser(state)
});

const mapDispatchToProps = { updateUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding);
