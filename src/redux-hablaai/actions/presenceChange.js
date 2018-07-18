export const PRESENCE_CHANGE = 'presence/change';

export const changePresence = presence => ({
  type: PRESENCE_CHANGE,
  payload: { presence }
});
