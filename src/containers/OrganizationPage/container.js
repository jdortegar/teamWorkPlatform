import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchSubscribersBySubscriberOrgId, fetchIntegrations, setCurrentSubscriberOrgId } from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getOrgTeams,
  getOrgIntegrationsObj
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
    orgId
  };
};

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationPage)
);
