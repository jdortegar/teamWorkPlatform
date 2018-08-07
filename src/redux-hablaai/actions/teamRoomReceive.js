export const TEAMROOM_RECEIVE = 'teamroom/receive';

export const receiveTeamRoom = teamRoom => ({
  type: TEAMROOM_RECEIVE,
  payload: { teamRoom }
});
