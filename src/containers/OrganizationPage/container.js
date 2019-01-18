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
  getOrgTeams,
  getOrgIntegrationsObj,
  getSubscription,
  getPaypalSubscription
} from 'src/selectors';
import { OrganizationPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { paypalSubscriptionId } = props.match.params;
  const orgId = getCurrentSubscriberOrgId(state);
  const subscriberOrg = state.subscriberOrgs.subscriberOrgById[orgId];
  return {
    subscriberOrg,
    paypalSubscriptionId,
    user: getCurrentUser(state),
    subscribers: Object.values(getUserByUserId(state)),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    teams: getOrgTeams(state),
    integrations: getOrgIntegrationsObj(state, orgId),
    orgId,
    subscription: getSubscription(state),
    paypalSubscription: getPaypalSubscription(state)
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
