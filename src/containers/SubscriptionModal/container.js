import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  cancelSubscription,
  fetchSubscription,
  fetchSubscriptionCoupons,
  updateSubscription,
  doPaypalSubscription,
  cancelPaypalSubscription,
  fetchPaypalSubscription
} from 'src/actions';
import { getCurrentSubscriberOrg, getSubscription, getSubscriptionCoupons, getPaypalSubscription } from 'src/selectors';
import { SubscriptionModal } from 'src/components';

const mapStateToProps = state => ({
  subscriberOrg: getCurrentSubscriberOrg(state),
  subscription: getSubscription(state),
  subscriptionCoupons: getSubscriptionCoupons(state),
  paypalSubscription: getPaypalSubscription(state)
});

const mapDispatchToProps = {
  cancelSubscription,
  fetchSubscription,
  fetchSubscriptionCoupons,
  updateSubscription,
  doPaypalSubscription,
  cancelPaypalSubscription,
  fetchPaypalSubscription
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriptionModal)
);
