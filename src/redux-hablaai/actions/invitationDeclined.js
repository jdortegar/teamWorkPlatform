export const INVITATION_DECLINED = 'invitation/declined';

export const declinedInvitation = (invitation) => {
  return {
    type: INVITATION_DECLINED,
    payload: { invitation }
  };
};
