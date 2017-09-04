import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TeamMemberPage from '../../pages/TeamMemberPage';
import { requestTeamRooms, requestTeamMembers } from '../../actions';

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamMemberPage));
