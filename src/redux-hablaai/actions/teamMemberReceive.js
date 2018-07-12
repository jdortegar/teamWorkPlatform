export const TEAMMEMBER_RECEIVE = 'teammember/receive';

export const receiveTeamMember = (teamMember, teamId) => dispatch => {
  dispatch({
    type: TEAMMEMBER_RECEIVE,
    payload: { teamMember, teamId }
  });
};
