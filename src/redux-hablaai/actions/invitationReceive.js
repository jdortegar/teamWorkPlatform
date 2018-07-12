export const INVITATION_RECEIVE = 'invitation/receive';

export const receiveInvitation = invitation => ({
  type: INVITATION_RECEIVE,
  payload: { invitation }
});
