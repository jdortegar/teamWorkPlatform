import { closeAllConnections } from '../messaging';

export const MESSAGING_CLOSED = 'messaging/close';

export const closeMessaging = () => dispatch => {
  const urls = closeAllConnections();

  urls.map(url =>
    dispatch({
      type: MESSAGING_CLOSED,
      payload: { url }
    })
  );
};
