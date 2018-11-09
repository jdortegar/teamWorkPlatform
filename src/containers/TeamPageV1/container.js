import { connect } from 'react-redux';
import { getTeam, getCurrentSubscriberOrg } from 'src/selectors';
import { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId } from 'src/actions';
import { TeamPageV1 } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { teamId } = props.match.params;

  return {
    teamId,
    team: getTeam(state, teamId),
    org: getCurrentSubscriberOrg(state)
  };
};

const mapDispatchToProps = {
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamPageV1);
