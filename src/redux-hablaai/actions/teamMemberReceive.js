export const TEAMMEMBER_RECEIVE = 'teammember/receive';

export const receiveTeamMember = (teamMember, teamId) => {
  return dispatch => {
    dispatch({
      type: TEAMMEMBER_RECEIVE,
      payload: { teamMember, teamId }
    });
  };
};
