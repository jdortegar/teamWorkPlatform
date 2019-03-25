import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { VideoCallModal } from 'src/components';
import { answerCall, answerTeamCall, finishCall } from 'src/actions';
import { getCurrentUser, getCallingData, getUserByUserId } from 'src/selectors';

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  callingData: getCallingData(state),
  users: Object.values(getUserByUserId(state)),
  user: getCurrentUser(state)
});

const mapDispatchToProps = {
  answerCall,
  answerTeamCall,
  finishCall
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoCallModal)
);
