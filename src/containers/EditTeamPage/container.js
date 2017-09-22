import { connect } from 'react-redux';
import EditTeamPage from '../../pages/EditTeamPage';
import { updateTeam } from '../../actions';

function mapStateToProps(state) {
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateTeam: (name, teamId) => dispatch(updateTeam(name, teamId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTeamPage);
