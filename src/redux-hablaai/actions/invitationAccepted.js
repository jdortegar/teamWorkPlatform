export const INVITATION_ACCEPTED = 'invitation/accepted';

export const acceptedInvitation = invitation => ({
  type: INVITATION_ACCEPTED,
  payload: { invitation }
});
