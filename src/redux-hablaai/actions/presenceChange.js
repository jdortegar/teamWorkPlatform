export const PRESENCE_CHANGE = 'presence/change';

export const changePresence = presence => {
  return {
    type: PRESENCE_CHANGE,
    payload: { presence }
  };
};
