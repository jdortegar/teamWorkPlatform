export const TEAMROOM_RECEIVE = 'teamroom/receive';

export const receiveTeamRoom = teamRoom => {
  return {
    type: TEAMROOM_RECEIVE,
    payload: { teamRoom }
  };
};
