import { connect } from 'react-redux';
import { getTeam, getCurrentSubscriberOrg } from 'src/selectors';
import { TeamPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;

  return {
    teamId,
    team: getTeam(state, teamId),
    org: getCurrentSubscriberOrg(state)
  };
};

export default connect(mapStateToProps)(TeamPage);
