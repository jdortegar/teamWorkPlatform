import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { requestResponse } from 'src/actions';
import { getTeam, getUserFullName } from 'src/selectors';
import { RequestNotification } from 'src/components';

const mapStateToProps = (state, props) => {
  return {
    team: getTeam(state, props.request.teamId),
    userFullName: getUserFullName(state, props.request.userId)
  };
};

const mapDispatchToProps = {
  requestResponse
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequestNotification)
);
