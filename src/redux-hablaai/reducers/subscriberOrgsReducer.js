import _ from 'lodash';
import {
  SUBSCRIBERORGS_FETCH_SUCCESS,
  SUBSCRIBERORG_RECEIVE,
  SUBSCRIBERORG_SETCURRENT,
  SUBSCRIBERORGS_DATA_FETCH_SUCCESS,
  UPDATED_TEAM_MEMBER_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  subscriberOrgById: {},
  orgData: {},
  currentSubscriberOrgId: null
};

function defaultSubscriberOrg(subscriberOrgs) {
  // The first enabled subscriberOrg.
  let selectedOrg = null;
  subscriberOrgs.some(subscriberOrg => {
    if (subscriberOrg.enabled === true) {
      selectedOrg = subscriberOrg;
      return true;
    }
    return false;
  });
  return selectedOrg;
}

const subscriberOrgsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBSCRIBERORGS_FETCH_SUCCESS: {
      const subscriberOrgById = {};
      let { currentSubscriberOrgId } = state;
      action.payload.subscriberOrgs.forEach(subscriberOrg => {
        subscriberOrgById[subscriberOrg.subscriberOrgId] = subscriberOrg;
      });
      const data = action.payload.subscriberOrgs;
      const notInList =
        currentSubscriberOrgId === null ||
        data.every(subscriberOrg => currentSubscriberOrgId !== subscriberOrg.subscriberOrgId);
      currentSubscriberOrgId = notInList
        ? defaultSubscriberOrg(action.payload.subscriberOrgs).subscriberOrgId
        : currentSubscriberOrgId;
      return {
        ...state,
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
    case SUBSCRIBERORGS_DATA_FETCH_SUCCESS:
      return {
        ...state,
        orgData: action.payload
      };
    case UPDATED_TEAM_MEMBER_SUCCESS: {
      const orgData = _.cloneDeep(state.orgData);
      const { userId, teamId, active } = action.payload.teamMemberUpdated;

      orgData.teams.forEach(teamEl => {
        if (teamEl.teamId === teamId) {
          teamEl.teamMembers.forEach(teamMemberEl => {
            if (teamMemberEl.userId === userId) {
              teamMemberEl.active = active; // eslint-disable-line no-param-reassign
            }
          });
        }
      });

      return {
        ...state,
        orgData
      };
    }
    default:
      return state;
  }
};

export default subscriberOrgsReducer;
