import _ from 'lodash';
import {
  RECEIVE_SUBSCRIBERS,
  RECEIVE_TEAM_MEMBERS,
  RECEIVE_TEAM_ROOM_MEMBERS
} from '../actions/types';

const INITIAL_STATE = {
  usersByUserId: {}
};

function receiverUsers(state, users) {
  const usersByUserId = _.cloneDeep(state.usersByUserId);
  users.forEach((subscriber) => { usersByUserId[subscriber.userId] = subscriber; });
  return {
    ...state,
    usersByUserId
  };
}

const usersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVE_SUBSCRIBERS:
      return receiverUsers(action.payload.subscribers);
    case RECEIVE_TEAM_MEMBERS:
      return receiverUsers(action.payload.teamMembers);
    case RECEIVE_TEAM_ROOM_MEMBERS:
      return receiverUsers(action.payload.teamRoomMembers);
    default:
      return state;
  }
};

export default usersReducer;
