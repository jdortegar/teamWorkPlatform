export const INVITATION_UPDATE = 'invitation/update';

export const updateInvitation = invitation => {
  return {
    type: INVITATION_UPDATE,
    payload: { invitation }
  };
};
