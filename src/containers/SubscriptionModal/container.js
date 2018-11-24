import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { cancelSubscription, fetchSubscription, fetchSubscriptionCoupons, updateSubscription } from 'src/actions';
import { getCurrentSubscriberOrg, getSubscription, getSubscriptionCoupons } from 'src/selectors';
import { SubscriptionModal } from 'src/components';

const mapStateToProps = state => ({
  subscriberOrg: getCurrentSubscriberOrg(state),
  subscription: getSubscription(state),
  subscriptionCoupons: getSubscriptionCoupons(state)
});

const mapDispatchToProps = {
  cancelSubscription,
  fetchSubscription,
  fetchSubscriptionCoupons,
  updateSubscription
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriptionModal)
);
