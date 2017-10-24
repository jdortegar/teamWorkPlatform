import urlRequestsReducer from './urlRequestsReducer';
import subscriberOrgsReducer from './subscriberOrgsReducer';
import teamsReducer from './teamsReducer';

const reducers = {
  urlRequests: urlRequestsReducer,
  subscriberOrgs: subscriberOrgsReducer,
  teams: teamsReducer
};

export default reducers;

