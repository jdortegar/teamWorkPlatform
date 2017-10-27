export const TEAMMEMBER_RECEIVE = 'teammember/receive';

export const receiveTeamMember = (teamMember) => {
  return {
    type: TEAMMEMBER_RECEIVE,
    payload: { teamMember }
  };
};
