import {
  REQUESTING_SUBSCRIBER_ORGS,
  RECEIVE_SUBSCRIBER_ORGS,
  REQUEST_SUBSCRIBER_ORGS_ERROR,
  SET_CURRENT_SUBSCRIBER_ORG_ID,
  CREATE_SUBSCRIBER_ORG,
  SUBMITTING_ORG_FORM
} from '../actions/types';

const INITIAL_STATE = {
  raw: [],
  subscriberOrgById: {},
  currentSubscriberOrgId: null,

  received: false,
  requesting: false,
  error: null,
  errorMeta: {},
  submittingOrgForm: false
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
    case REQUESTING_SUBSCRIBER_ORGS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null,
        errorMeta: {}
      };
    case SUBMITTING_ORG_FORM: {
      return {
        ...state,
        submittingOrgForm: action.payload
      };
    }
    case CREATE_SUBSCRIBER_ORG: {
      return {
        ...state,
        data: [...state.data, action.payload]
      };
    }
    case RECEIVE_SUBSCRIBER_ORGS: {
      const raw = action.payload.subscriberOrgs;
      const subscriberOrgById = {};
      let currentSubscriberOrgId = state.currentSubscriberOrgId;
      action.payload.subscriberOrgs.forEach((subscriberOrg) => { subscriberOrgById[subscriberOrg.subscriberOrgId] = subscriberOrg; });
      const data = action.payload;
      const notInList = (currentSubscriberOrgId === null) || data.every(subscriberOrg => (currentSubscriberOrgId !== subscriberOrg.subscriberOrgId));
      currentSubscriberOrgId = (notInList) ? defaultSubscriberOrg(action.payload.subscriberOrgs).subscriberOrgId : currentSubscriberOrgId;
      return {
        ...state,
        raw,
        subscriberOrgById,
        currentSubscriberOrgId,
        received: true,
        requesting: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_SUBSCRIBER_ORGS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload,
        errorMeta: action.meta || {}
      };
    case SET_CURRENT_SUBSCRIBER_ORG_ID:
      return {
        ...state,
        currentSubscriberOrgId: action.payload
      };
    default:
      return state;
  }
};

export default subscriberOrgsReducer;
