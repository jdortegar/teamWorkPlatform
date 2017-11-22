import { fetchTeamRooms } from './teamRoomsFetch';

export const TEAMROOMMEMBER_RECEIVE = 'teamroommember/receive';

export const receiveTeamRoomMember = (teamRoomMember, teamRoomId) => {
  return ((dispatch, getState) => {
    const teamRoom = getState().teamRooms.teamRoomById[teamRoomId];
    if (!teamRoom) {
      dispatch(fetchTeamRooms({ forceGet: true }))
        .then(() => {
          dispatch({
            type: TEAMROOMMEMBER_RECEIVE,
            payload: { teamRoomMember, teamRoomId }
          });
        });
    } else {
      dispatch({
        type: TEAMROOMMEMBER_RECEIVE,
        payload: { teamRoomMember, teamRoomId }
      });
    }
  });
};
