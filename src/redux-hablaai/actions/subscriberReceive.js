export const SUBSCRIBER_RECEIVE = 'subscriber/receive';

export const receiveSubscriber = (subscriber, subscriberOrgId) => {
  return {
    type: SUBSCRIBER_RECEIVE,
    payload: { subscriber, subscriberOrgId }
  };
};
