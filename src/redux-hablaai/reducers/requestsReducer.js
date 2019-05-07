import {
  REQUEST_RECEIVE,
  REQUEST_UPDATE,
  REQUEST_RESPONSE,
  REQUEST_RESPONSE_UPDATE,
  REQUESTS_FETCH_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  requests: [],
  responseRequests: null
};

const requestsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUESTS_FETCH_SUCCESS:
    case REQUEST_RECEIVE: {
      const requestsArray = action.payload.requests ? action.payload.requests : [{ ...action.payload.request }];
      const requests = [...state.requests, ...requestsArray];
      const filterRequest = requests
        .reduce(
          (acc, request) => {
            const l = acc.filter(r => {
              return r.userId === request.userId && r.teamId === request.teamId;
            });
            if (l.length === 0) {
              return [...acc, request];
            }
            return acc;
          },
          [requests[0]]
        )
        .filter(el => el != null);

      return { ...state, requests: filterRequest };
    }
    case REQUEST_UPDATE: {
      const requests = state.requests.filter(request => request.requestId !== action.payload.request.requestId);
      return { ...state, requests: [...requests] };
    }
    case REQUEST_RESPONSE: {
      return { ...state, responseRequests: action.payload.request };
    }
    case REQUEST_RESPONSE_UPDATE: {
      return { ...state, responseRequests: null };
    }
    default:
      return state;
  }
};

export default requestsReducer;
