import { connect } from 'react-redux';
import EditUserPage from '../../pages/EditUserPage';
import { updateTeam } from '../../actions';
// import { getUrlRequestStatus } from '../../selectors';

function mapStateToProps(state) {
  return {
    user: state.auth.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateTeam: (name, teamId) => dispatch(updateTeam(name, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUserPage);
