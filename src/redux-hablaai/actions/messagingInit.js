import config from 'src/config/env';
import { startApiMessaging, startChatMessaging } from '../messaging';
import { eventHandler } from './eventHandler';
import { onlineOfflineListener } from './urlRequest';

export const MESSAGING_STARTED = 'messaging/start';

export const initMessaging = () => (dispatch, getState) => {
  const {
    auth: { websocketUrl, token }
  } = getState();
  if (!websocketUrl || !token) return;

  const apiSocket = startApiMessaging(websocketUrl);
  apiSocket.connect(token);
  apiSocket.addEventListener(eventHandler(dispatch));
  apiSocket.addOnlineOfflineListener(onlineOfflineListener);

  const chatSocket = startChatMessaging(config.chatRoot);
  chatSocket.connect(token);
  chatSocket.addEventListener(eventHandler(dispatch));
  chatSocket.addOnlineOfflineListener(onlineOfflineListener);

  dispatch({
    type: MESSAGING_STARTED,
    payload: { url: apiSocket.url }
  });
};
