import urlRequestsReducer from './urlRequestsReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import subscribersReducer from './subscribersReducer';
import teamsReducer from './teamsReducer';
import teamMembersReducer from './teamMembersReducer';
import teamRoomsReducer from './teamRoomsReducer';

const reducers = {
  urlRequests: urlRequestsReducer,

  subscriberOrgs: subscriberOrgsReducer,

  subscribers: subscribersReducer,

  teams: teamsReducer,

  teamMembers: teamMembersReducer,

  teamRooms: teamRoomsReducer,

  //teamRoomMembers: teamRoomMembersReducer
};

export default reducers;
