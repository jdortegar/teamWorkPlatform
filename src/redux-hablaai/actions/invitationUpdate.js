export const INVITATION_UPDATE = 'invitation/update';

export const updateInvitation = invitation => ({
  type: INVITATION_UPDATE,
  payload: { invitation }
});
