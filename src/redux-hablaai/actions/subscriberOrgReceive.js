export const SUBSCRIBERORG_RECEIVE = 'subscriberOrg/receive';

export const receiveSubscriberOrg = subscriberOrg => ({
  type: SUBSCRIBERORG_RECEIVE,
  payload: { subscriberOrg }
});
