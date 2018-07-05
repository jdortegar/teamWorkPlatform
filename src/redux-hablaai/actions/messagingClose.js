import messaging from '../messaging';

export const MESSAGING_CLOSED = 'messaging/close';

export const closeMessaging = () => {
  return (dispatch) => {
    const messagingInstance = messaging();

    if (messagingInstance) {
      dispatch({
        type: MESSAGING_CLOSED,
        payload: { url: messagingInstance.url }
      });
      messagingInstance.close();
    }
  };
};
