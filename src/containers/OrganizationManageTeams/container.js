import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateTeam } from 'src/actions';
import {
  getCurrentUser,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getCurrentSubscriberOrgId
} from 'src/selectors';

import { OrganizationManageTeams } from 'src/pages';

const mapStateToProps = state => ({
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  user: getCurrentUser(state),
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
