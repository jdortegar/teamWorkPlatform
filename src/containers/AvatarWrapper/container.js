import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AvatarWrapper } from 'src/components';
import { makePersonalCall } from 'src/actions';
import { getCurrentUser } from 'src/selectors';

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

const mapDispatchToProps = {
  makePersonalCall
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AvatarWrapper)
);
