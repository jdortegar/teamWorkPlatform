import { connect } from 'react-redux';
import EditTeamPage from '../../pages/EditTeamPage';
import { updateTeam } from '../../actions';
import { getUrlRequestStatus } from '../../selectors';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: state.teams,
    updateTeamRequestStatus: getUrlRequestStatus(state, updateTeam(null, teamId, true))
  };
};

const mapDispatchToProps = dispatch => ({
  updateTeam: (name, teamId) => dispatch(updateTeam(name, teamId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeamPage);
