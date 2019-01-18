/**
 * Return array of subscriberOrgs.
 */

export const getSubscription = state => state.subscription.stripeSubscription;
export const getPaypalSubscription = state => state.subscription.paypalSubscription;

export const getSubscriptionCoupons = state => state.subscription.coupons;
