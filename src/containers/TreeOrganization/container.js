import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchDataSubscriberOrgs,
  updateTeam,
  updateTeamMember,
  revokeOrgIntegration
} from 'src/actions';
import {
  getSubscriberOrgsSortedAlphabetically,
  getOrgTeams,
  getOrgData,
  getCurrentSubscriberOrgId,
  getUserByUserId
} from 'src/selectors';
import { TreeOrganization } from 'src/components';

const mapStateToProps = state => ({
  subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
  orgData: getOrgData(state),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  users: getUserByUserId(state),
  teams: getOrgTeams(state, getCurrentSubscriberOrgId(state))
});

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchDataSubscriberOrgs,
  updateTeam,
  updateTeamMember,
  revokeOrgIntegration
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TreeOrganization)
);
