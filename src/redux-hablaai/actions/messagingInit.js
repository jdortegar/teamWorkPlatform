import messaging from '../messaging';
import { eventHandler, onlineOfflineListener } from './';

export const MESSAGING_STARTED = 'messaging/start';

export const initMessaging = () => (dispatch, getState) => {
  const {
    auth: { websocketUrl, token }
  } = getState();
  if (!websocketUrl || !token) return;

  const messagingInstance = messaging(websocketUrl);
  messagingInstance.connect(token);
  messagingInstance.addEventListener(eventHandler(dispatch));
  messagingInstance.addOnlineOfflineListener(onlineOfflineListener);

  dispatch({
    type: MESSAGING_STARTED,
    payload: { url: messagingInstance.url }
  });
};
