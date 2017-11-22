import { fetchSubscriberOrgs } from './subscriberOrgsFetch';

export const SUBSCRIBER_RECEIVE = 'subscriber/receive';

export const receiveSubscriber = (subscriber, subscriberOrgId) => {
  return ((dispatch, getState) => {
    const subscriberOrg = getState().subscriberOrgs.subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      dispatch(fetchSubscriberOrgs({ forceGet: true }))
        .then(() => {
          dispatch({
            type: SUBSCRIBER_RECEIVE,
            payload: { subscriber, subscriberOrgId }
          });
        });
    } else {
      dispatch({
        type: SUBSCRIBER_RECEIVE,
        payload: { subscriber, subscriberOrgId }
      });
    }
  });
};
