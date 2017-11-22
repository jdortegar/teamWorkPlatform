import { fetchTeams } from './teamsFetch';

export const TEAMMEMBER_RECEIVE = 'teammember/receive';

export const receiveTeamMember = (teamMember, teamId) => {
  return ((dispatch, getState) => {
    const team = getState().teams.teamById[teamId];
    if (!team) {
      dispatch(fetchTeams({ forceGet: true }))
        .then(() => {
          dispatch({
            type: TEAMMEMBER_RECEIVE,
            payload: { teamMember, teamId }
          });
        });
    } else {
      dispatch({
        type: TEAMMEMBER_RECEIVE,
        payload: { teamMember, teamId }
      });
    }
  });
};
