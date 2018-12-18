import axios from 'axios';

export const URLREQUEST_CREATE = 'urlrequest/create';
export const URLREQUEST_SUCCESS = 'urlrequest/success';
export const URLREQUEST_FAILURE = 'urlrequest/failure';
export const URLREQUEST_CLEAR = 'urlrequest/clear';

export const RESPONSE_STALE = 'STALE';

const CACHE_GET_REQUESTS = true;
const AUTO_FETCH_STALE_DATE = true;

export const cachedGetRequests = {};
export const cachedGetRequestsOrdered = [];

export const createUrlRequest = payload => ({
  type: URLREQUEST_CREATE,
  payload
});

export const urlRequestSuccess = payload => ({
  type: URLREQUEST_SUCCESS,
  payload
});

export const urlRequestFailure = payload => ({
  type: URLREQUEST_FAILURE,
  payload
});

export const clearUrlRequest = requestUrl => ({
  type: URLREQUEST_CLEAR,
  payload: { requestUrl }
});

export const doRequest = ({ requestUrl, method, headers, data }, reduxState, options = { cache: false }) => (
  dispatch,
  getState
) => {
  // Check if a request for the exact same requestUrl exists and return the current request promise
  const urlRequest = getState().urlRequests[requestUrl];
  if (urlRequest && urlRequest.actionType === URLREQUEST_CREATE && urlRequest.request && urlRequest.request.then) {
    return urlRequest.request;
  }

  // check if there's a cached response and return it. The request must enable cache with { cache: true }
  if (options.cache && method.toLowerCase() === 'get') {
    const cachedGetRequest = cachedGetRequests[requestUrl];
    if (cachedGetRequest) {
      dispatch(createUrlRequest({ requestUrl, request: cachedGetRequest.request, ...cachedGetRequest.reduxState }));
      dispatch(urlRequestSuccess({ requestUrl, ...cachedGetRequest.reduxState }));
      dispatch(clearUrlRequest(requestUrl));
      cachedGetRequest.response.data = RESPONSE_STALE;
      return Promise.resolve(cachedGetRequest.response);
    }
  }

  // Do the request
  const request = axios({ method, url: requestUrl, headers, data })
    .then(response => {
      if (CACHE_GET_REQUESTS && method.toLowerCase() === 'get') {
        cachedGetRequests[requestUrl] = { response, request, reduxState };
        cachedGetRequestsOrdered.push(requestUrl);
      }

      dispatch(urlRequestSuccess({ requestUrl, ...reduxState }));
      dispatch(clearUrlRequest(requestUrl));
      return response;
    })
    .catch(error => {
      dispatch(urlRequestFailure({ requestUrl, error, ...reduxState }));
      dispatch(clearUrlRequest(requestUrl));
      throw error;
    });

  dispatch(createUrlRequest({ requestUrl, request, ...reduxState }));

  return request;
};

export const doAuthenticatedRequest = (
  { requestUrl, method, additionalHeaders = {}, data },
  reduxState = {},
  options = { cache: false }
) => (dispatch, getState) => {
  const secureHeaders = {
    Authorization: `Bearer ${getState().auth.token}`,
    ...additionalHeaders
  };
  return dispatch(doRequest({ requestUrl, method, headers: secureHeaders, data }, reduxState, options));
};

let previouslyOnline = false;
export const onlineOfflineListener = online => {
  // When back online after being offline.
  if (online && !previouslyOnline) {
    if (AUTO_FETCH_STALE_DATE) {
      cachedGetRequestsOrdered.forEach(requestUrl => {
        const { reduxState } = cachedGetRequests[requestUrl];
        doAuthenticatedRequest(
          {
            requestUrl,
            method: 'get'
          },
          reduxState
        );
      });
    }

    Object.keys(cachedGetRequests).forEach(requestUrl => {
      delete cachedGetRequests[requestUrl];
    });
    cachedGetRequestsOrdered.length = 0;
  }
  previouslyOnline = online;
};

export const clearCachedGetRequests = () => {
  cachedGetRequestsOrdered.forEach(requestUrl => {
    delete cachedGetRequests[requestUrl];
  });
  cachedGetRequestsOrdered.length = 0;
};
