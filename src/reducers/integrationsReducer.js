import _ from 'lodash';
import {
  REQUESTING_INTEGRATIONS,
  RECEIVE_INTEGRATIONS,
  REQUEST_INTEGRATIONS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  data: [],
  received: false,
  requesting: false,
  error: null
};

const integrationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTING_INTEGRATIONS:
      return {
        ...state,
        data: [],
        received: false,
        requesting: true,
        error: null
      };
    case RECEIVE_INTEGRATIONS:
      return {
        ...state,
        data: _.merge(state.data, action.payload),
        received: true,
        requesting: false,
        error: null
      };
    case REQUEST_INTEGRATIONS_ERROR:
      return {
        ...state,
        data: [],
        received: false,
        requesting: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default integrationsReducer;
