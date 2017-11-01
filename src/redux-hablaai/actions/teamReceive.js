export const TEAM_RECEIVE = 'team/receive';

export const receiveTeam = (team) => {
  return {
    type: TEAM_RECEIVE,
    payload: { team }
  };
};
