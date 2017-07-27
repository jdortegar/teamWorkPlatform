import _ from 'lodash';
import {
  REQUESTING_INTEGRATIONS,
  RECEIVE_INTEGRATIONS,
  REQUEST_INTEGRATIONS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  integrationsBySubscriberOrgId: {},
  received: false,
  requesting: false,
  error: null
};

const integrationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_INTEGRATIONS:
      return {
        ...state,
        received: false,
        requesting: true,
        error: null
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
        received: true,
        requesting: false,
        error: null
      };
    }
    case REQUEST_INTEGRATIONS_ERROR:
      return {
        ...state,
        received: false,
        requesting: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default integrationsReducer;
