import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { TeamCallButton } from 'src/components';
import { makeTeamCall } from 'src/actions';
import { getCurrentUser } from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    user: getCurrentUser(state),
    teamId
  };
};

const mapDispatchToProps = {
  makeTeamCall
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamCallButton)
);
