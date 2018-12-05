import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchSubscription
} from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getOrgTeams,
  getOrgIntegrationsObj,
  getSubscription
} from 'src/selectors';
import { OrganizationPage } from 'src/pages';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  const subscriberOrg = state.subscriberOrgs.subscriberOrgById[orgId];
  return {
    subscriberOrg,
    user: getCurrentUser(state),
    subscribers: getSubscribersOfSubscriberOrgId(state, orgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    teams: getOrgTeams(state),
    integrations: getOrgIntegrationsObj(state, orgId),
    orgId,
    subscription: getSubscription(state)
  };
};

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchSubscription
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationPage)
);
