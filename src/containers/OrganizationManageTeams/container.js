import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateTeam } from 'src/actions';
import {
  getUserByUserId,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getCurrentSubscriberOrgId
} from 'src/selectors';

import { OrganizationManageTeams } from 'src/pages';

const mapStateToProps = state => ({
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  users: getUserByUserId(state),
  teams: getTeamsOfSubscriberOrgIdSortedAlphabetically(state, getCurrentSubscriberOrgId(state))
});

const mapDispatchToProps = {
  updateTeam
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManageTeams)
);
