export const SUBSCRIBER_RECEIVE = 'subscriber/receive';

export const receiveSubscriber = (subscriber) => {
  return {
    type: SUBSCRIBER_RECEIVE,
    payload: { subscriber }
  };
};
