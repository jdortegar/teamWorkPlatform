import { fetchTeamRooms } from './teamRoomsFetch';

export const TEAMROOMMEMBER_RECEIVE = 'teamroommember/receive';

export const receiveTeamRoomMember = (teamRoomMember, teamRoomId) => {
  return ((dispatch, getState) => {
    const teamRoom = getState().teamRooms.teamRoomById[teamRoomId];
    if (!teamRoom) {
      return dispatch(fetchTeamRooms({ forceGet: true }))
        .then(() => {
          dispatch({
            type: TEAMROOMMEMBER_RECEIVE,
            payload: { teamRoomMember, teamRoomId }
          });
        });
    }

    return {
      type: TEAMROOMMEMBER_RECEIVE,
      payload: { teamRoomMember, teamRoomId }
    };
  });
};
