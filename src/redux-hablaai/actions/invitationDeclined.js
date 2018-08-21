export const INVITATION_DECLINED = 'invitation/declined';

export const declinedInvitation = invitation => ({
  type: INVITATION_DECLINED,
  payload: { invitation }
});
