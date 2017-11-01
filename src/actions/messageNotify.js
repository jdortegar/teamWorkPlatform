export const NOTIFY_MESSAGE = 'notify_message';

export function notifyMessage(messages) {
  return {
    type: NOTIFY_MESSAGE,
    payload: { messages }
  };
}
