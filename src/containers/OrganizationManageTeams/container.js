import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateTeam, fetchDataSubscriberOrgs } from 'src/actions';
import { getUserByUserId, getCurrentSubscriberOrgId, getOrgData, getOrgTeams } from 'src/selectors';

import { OrganizationManageTeams } from 'src/pages';

const mapStateToProps = state => ({
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  users: getUserByUserId(state),
  teams: getOrgTeams(state, getCurrentSubscriberOrgId(state)),
  orgData: getOrgData(state)
});

const mapDispatchToProps = {
  updateTeam,
  fetchDataSubscriberOrgs
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManageTeams)
);
