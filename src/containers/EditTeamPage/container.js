import { connect } from 'react-redux';
import { updateTeam } from 'src/actions';
import { getTeamsById, getUrlRequestStatus } from 'src/selectors';
import { EditTeamPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;
  return {
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    teams: getTeamsById(state),
    updateTeamRequestStatus: getUrlRequestStatus(state, updateTeam(null, teamId, true))
  };
};

const mapDispatchToProps = { updateTeam };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditTeamPage);
