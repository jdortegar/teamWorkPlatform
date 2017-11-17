import { fetchSubscriberOrgs } from './subscriberOrgsFetch';

export const SUBSCRIBER_RECEIVE = 'subscriber/receive';

export const receiveSubscriber = (subscriber, subscriberOrgId) => {
  return ((dispatch, getState) => {
    const subscriberOrg = getState().subscriberOrgs.subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      return dispatch(fetchSubscriberOrgs({ forceGet: true }))
        .then(() => {
          dispatch({
            type: SUBSCRIBER_RECEIVE,
            payload: { subscriber, subscriberOrgId }
          });
        });
    }

    return {
      type: SUBSCRIBER_RECEIVE,
      payload: { subscriber, subscriberOrgId }
    };
  });
};
