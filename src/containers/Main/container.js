import { connect } from 'react-redux';
import { Main } from 'src/layouts';
import {
  initMessaging,
  closeMessaging,
  fetchGlobalState,
  fetchInvitations,
  fetchRequests,
  fetchSubscriberOrgs,
  fetchSubscription
} from 'src/actions';
import { getCurrentSubscriberOrgId, getSubscription } from 'src/selectors';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  const subscriberOrg = state.subscriberOrgs.subscriberOrgById[orgId];
  return {
    subscriberOrg,
    subscriberOrgs: state.subscriberOrgs,
    subscription: getSubscription(state)
  };
};

const mapDispatchToProps = {
  initMessaging,
  closeMessaging,
  fetchGlobalState,
  fetchInvitations,
  fetchRequests,
  fetchSubscriberOrgs,
  fetchSubscription
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
