export const INVITATION_RECEIVE = 'invitation/recieve';

export const receiveInvitation = (invitation) => {
  return {
    type: INVITATION_RECEIVE,
    payload: { invitation }
  };
};
