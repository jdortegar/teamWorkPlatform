export const INVITATION_DECLINED_UPDATE = 'invitationDeclined/update';

export const updateInvitationDeclined = (invitation) => {
  return {
    type: INVITATION_DECLINED_UPDATE,
    payload: { invitation }
  };
};
