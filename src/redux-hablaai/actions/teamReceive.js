export const TEAM_RECEIVE = 'team/receive';

export const receiveTeam = team => ({
  type: TEAM_RECEIVE,
  payload: { team }
});
