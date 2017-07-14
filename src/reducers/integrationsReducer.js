import { RECEIVE_INTEGRATIONS } from '../actions/types';

const integrationsReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_INTEGRATIONS:
      console.log(`AD: action=${JSON.stringify(action)}`);
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default integrationsReducer;
