import { combineReducers } from 'redux';
import _ from 'lodash';

import {
  INTEGRATIONS_FETCH_SUCCESS,
  INTEGRATIONS_FETCH_CONTENT_REQUEST,
  INTEGRATIONS_FETCH_CONTENT_SUCCESS,
  INTEGRATIONS_FETCH_CONTENT_FAILURE,
  INTEGRATIONS_REVOKE_SUCCESS,
  INTEGRATIONS_UPDATE,
  TEAM_INTEGRATIONS_FETCH_SUCCESS,
  TEAM_INTEGRATIONS_REVOKE_SUCCESS
} from 'src/actions';

const byOrg = (state = {}, action) => {
  switch (action.type) {
    case INTEGRATIONS_FETCH_SUCCESS: {
      const { integrations = [] } = action.payload;
      return {
        ...state,
        ...integrations.reduce((acc, orgIntegrations) => {
          acc[orgIntegrations.subscriberOrgId] = _.omit(orgIntegrations, 'subscriberOrgId');
          return acc;
        }, {})
      };
    }
    case INTEGRATIONS_UPDATE: {
      const { subscriberOrgId, integrations } = action.payload;
      return {
        ...state,
        [subscriberOrgId]: integrations
      };
    }
    case INTEGRATIONS_REVOKE_SUCCESS: {
      if (action.error) return state;

      const { orgId, source } = action.payload;
      const orgIntegrations = state[orgId] || {};
      return {
        ...state,
        [orgId]: {
          ...orgIntegrations,
          [source]: { revoked: true }
        }
      };
    }
    default:
      return state;
  }
};

const byTeam = (state = {}, action) => {
  switch (action.type) {
    case TEAM_INTEGRATIONS_FETCH_SUCCESS: {
      const { teamMemberIntegrations } = action.payload;
      return {
        ...state,
        ...teamMemberIntegrations.reduce(
          (acc, { teamId, userId, integrations }) => ({
            ...acc,
            [teamId]: {
              ...acc[teamId],
              [userId]: integrations
            }
          }),
          {}
        )
      };
    }
    case TEAM_INTEGRATIONS_REVOKE_SUCCESS: {
      if (action.error) return state;

      const { teamId, userId, source } = action.payload;
      const teamIntegrations = state[teamId] || {};
      const userIntegrations = teamIntegrations[userId] || {};

      return {
        ...state,
        [teamId]: {
          ...teamIntegrations,
          [userId]: {
            ...userIntegrations,
            [source]: { revoked: true }
          }
        }
      };
    }
    default:
      return state;
  }
};

const content = (state = { isFetching: false, error: null }, action) => {
  switch (action.type) {
    case INTEGRATIONS_FETCH_CONTENT_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case INTEGRATIONS_FETCH_CONTENT_SUCCESS: {
      const {
        files,
        folders,
        source,
        habla_user_id: hablaUserId,
        subscriber_user_id: subscriberUserId,
        subscriber_org_id: orgId
      } = action.payload.content;
      return {
        files,
        folders,
        source,
        hablaUserId,
        subscriberUserId,
        orgId,
        isFetching: false,
        error: null
      };
    }
    case INTEGRATIONS_FETCH_CONTENT_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.payload.error
      };
    }
    default:
      return state;
  }
};

const integrationsReducer = combineReducers({
  byOrg,
  byTeam,
  content
});

export default integrationsReducer;
