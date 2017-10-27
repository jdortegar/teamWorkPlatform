export const TEAMROOMMEMBER_RECEIVE = 'teamroommember/receive';

export const receiveTeamRoomMember = (teamRoomMember) => {
  return {
    type: TEAMROOMMEMBER_RECEIVE,
    payload: { teamRoomMember }
  };
};
