import _ from 'lodash';
import {
  REQUESTING_INTEGRATIONS,
  RECEIVE_INTEGRATIONS,
  RECEIVE_REVOKE_INTEGRATION,
  REQUEST_INTEGRATIONS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  integrationsBySubscriberOrgId: {},
  working: false,
  error: null,
  errorMeta: {}
};

const integrationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_INTEGRATIONS:
      return {
        ...state,
        working: true,
        error: null,
        errorMeta: {}
      };
    case RECEIVE_INTEGRATIONS: {
      const updateIntegrationsBySubscriberOrgId = _.cloneDeep(state.integrationsBySubscriberOrgId);
      action.payload.forEach((integration) => {
        const { subscriberOrgId, box, google } = integration;
        const updateIntegration = { box, google };
        updateIntegrationsBySubscriberOrgId[subscriberOrgId] = updateIntegration;
      });
      return {
        ...state,
        integrationsBySubscriberOrgId: updateIntegrationsBySubscriberOrgId,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case RECEIVE_REVOKE_INTEGRATION: {
      if (action.error) {
        return {
          ...state,
          working: false,
          error: action.payload,
          errorMeta: action.meta || {}
        };
      }

      const integrationsBySubscriberOrgId = _.cloneDeep(state.integrationsBySubscriberOrgId);
      const integrations = integrationsBySubscriberOrgId[action.payload.subscriberOrgId];
      if (integrations) {
        integrations[action.payload.type] = { revoked: true };
      }
      return {
        ...state,
        integrationsBySubscriberOrgId,
        working: false,
        error: null,
        errorMeta: {}
      };
    }
    case REQUEST_INTEGRATIONS_ERROR:
      return {
        ...state,
        working: false,
        error: action.payload,
        errorMeta: action.meta || {}
      };
    default:
      return state;
  }
};

export default integrationsReducer;
