import { fetchTeams } from './teamsFetch';

export const TEAMMEMBER_RECEIVE = 'teammember/receive';

export const receiveTeamMember = (teamMember, teamId) => {
  return ((dispatch, getState) => {
    const team = getState().teams.teamById[teamId];
    if (!team) {
      return dispatch(fetchTeams({ forceGet: true }))
        .then(() => {
          dispatch({
            type: TEAMMEMBER_RECEIVE,
            payload: { teamMember, teamId }
          });
        });
    }

    return {
      type: TEAMMEMBER_RECEIVE,
      payload: { teamMember, teamId }
    };
  });
};
