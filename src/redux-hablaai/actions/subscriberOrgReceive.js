export const SUBSCRIBERORG_RECEIVE = 'subscriberOrg/receive';

export const receiveSubscriberOrg = (subscriberOrg) => {
  return {
    type: SUBSCRIBERORG_RECEIVE,
    payload: { subscriberOrg }
  };
};
