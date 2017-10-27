import urlRequestsReducer from './urlRequestsReducer';
import usersReducer from './usersReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import subscribersReducer from './subscribersReducer';
import teamsReducer from './teamsReducer';
import teamMembersReducer from './teamMembersReducer';
import teamRoomsReducer from './teamRoomsReducer';
import teamRoomMembersReducer from './teamRoomMembersReducer';
import conversationsReducer from './conversationsReducer';

const reducers = {
  urlRequests: urlRequestsReducer,

  users: usersReducer,

  subscriberOrgs: subscriberOrgsReducer,

  subscribers: subscribersReducer,

  teams: teamsReducer,

  teamMembers: teamMembersReducer,

  teamRooms: teamRoomsReducer,

  teamRoomMembers: teamRoomMembersReducer,

  conversations: conversationsReducer
};

export default reducers;
