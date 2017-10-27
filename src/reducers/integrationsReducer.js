import _ from 'lodash';
import {
  INTEGRATIONS_FETCH_SUCCESS,
  INTEGRATIONS_REVOKE_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  integrationsBySubscriberOrgId: {}
};

const integrationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INTEGRATIONS_FETCH_SUCCESS: {
      const updateIntegrationsBySubscriberOrgId = _.cloneDeep(state.integrationsBySubscriberOrgId);
      action.payload.integrations.forEach((integration) => {
        const { subscriberOrgId, box, google } = integration;
        const updateIntegration = { box, google };
        updateIntegrationsBySubscriberOrgId[subscriberOrgId] = updateIntegration;
      });
      return {
        ...state,
        integrationsBySubscriberOrgId: updateIntegrationsBySubscriberOrgId,
      };
    }
    case INTEGRATIONS_REVOKE_SUCCESS: {
      if (action.error) {
        return {
          ...state
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
    default:
      return state;
  }
};

export default integrationsReducer;
