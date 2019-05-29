import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchSubscription,
  fetchPaypalSubscription
} from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentUserTeams,
  getOrgIntegrationsObj,
  getSubscription,
  getPaypalSubscription,
  getUserRoles,
  getTeams,
  getUserIdsByTeamId
} from 'src/selectors';
import { OrganizationPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const orgId = getCurrentSubscriberOrgId(state);
  const subscriberOrg = state.subscriberOrgs.subscriberOrgById[orgId];
  const { paypalSubscriptionId } = props.match.params;

  const userRoles = getUserRoles(state);

  let teams = getCurrentUserTeams(state);

  if (userRoles && userRoles.admin) {
    teams = getTeams(state);
  }
  return {
    subscriberOrg,
    user: getCurrentUser(state),
    subscribers: Object.values(getUserByUserId(state)),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    integrations: getOrgIntegrationsObj(state, orgId),
    orgId,
    teams,
    subscription: getSubscription(state),
    paypalSubscription: getPaypalSubscription(state),
    paypalSubscriptionId,
    teamMembersByTeamId: getUserIdsByTeamId(state)
  };
};

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchSubscription,
  fetchPaypalSubscription
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationPage)
);
