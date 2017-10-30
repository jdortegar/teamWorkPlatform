export const TEAMMEMBER_RECEIVE = 'teammember/receive';

export const receiveTeamMember = (teamMember, teamId) => {
  return {
    type: TEAMMEMBER_RECEIVE,
    payload: { teamMember, teamId }
  };
};
