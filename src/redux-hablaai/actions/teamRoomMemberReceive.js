export const TEAMROOMMEMBER_RECEIVE = 'teamroommember/receive';

export const receiveTeamRoomMember = (teamRoomMember, teamRoomId) => dispatch => {
  dispatch({
    type: TEAMROOMMEMBER_RECEIVE,
    payload: { teamRoomMember, teamRoomId }
  });
};
