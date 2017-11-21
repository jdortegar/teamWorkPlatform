export const INVITATION_RECEIVE = 'invitation/receive';

export const receiveInvitation = (invitation) => {
  return {
    type: INVITATION_RECEIVE,
    payload: { invitation }
  };
};
