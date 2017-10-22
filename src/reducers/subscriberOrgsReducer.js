import _ from 'lodash';
import {
  SUBSCRIBERORGS_FETCH_SUCCESS,
  SUBSCRIBERORG_RECEIVE,
  SUBSCRIBERORG_SETCURRENT
} from '../actions';

const INITIAL_STATE = {
  raw: [],
  subscriberOrgById: {},
  currentSubscriberOrgId: null
};

function defaultSubscriberOrg(subscriberOrgs) {
  // The first enabled subscriberOrg.
  let selectedOrg = null;
  for (const subscriberOrg of subscriberOrgs) {
    if (subscriberOrg.enabled === true) {
      selectedOrg = subscriberOrg;
      break;
    }
  }
  return selectedOrg;
}

const subscriberOrgsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIBERORGS_FETCH_SUCCESS: {
      const raw = action.payload.subscriberOrgs;
      const subscriberOrgById = {};
      let currentSubscriberOrgId = state.currentSubscriberOrgId;
      action.payload.subscriberOrgs.forEach((subscriberOrg) => { subscriberOrgById[subscriberOrg.subscriberOrgId] = subscriberOrg; });
      const data = action.payload.subscriberOrgs;
      const notInList = (currentSubscriberOrgId === null) || data.every(subscriberOrg => (currentSubscriberOrgId !== subscriberOrg.subscriberOrgId));
      currentSubscriberOrgId = (notInList) ? defaultSubscriberOrg(action.payload.subscriberOrgs).subscriberOrgId : currentSubscriberOrgId;
      return {
        ...state,
        raw,
        subscriberOrgById,
        currentSubscriberOrgId
      };
    }
    case SUBSCRIBERORG_RECEIVE: {
      const subscriberOrgById = _.cloneDeep(state.subscriberOrgById);
      subscriberOrgById[action.payload.subscriberOrg.subscriberOrgId] = action.payload.subscriberOrg;
      return {
        ...state,
        subscriberOrgById
      };
    }
    case SUBSCRIBERORG_SETCURRENT:
      return {
        ...state,
        currentSubscriberOrgId: action.payload
      };
    default:
      return state;
  }
};

export default subscriberOrgsReducer;
