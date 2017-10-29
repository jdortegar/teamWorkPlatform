import axios from 'axios';
import config from '../config';

export const URLREQUEST = 'urlrequest';
export const URLREQUEST_SUCCESS = 'urlrequest/success';
export const URLREQUEST_ERROR = 'urlrequest/error';
export const URLREQUEST_CLEAR = 'urlrequest/clear';

export const cachedGetRequests = {};

export const clearUrlRequest = (requestUrl) => {
  return {
    type: URLREQUEST_CLEAR,
    payload: { requestUrl }
  };
};

export const doRequest = ({ requestUrl, method, headers, data }, reduxState, getKey = false) => {
  if (getKey) {
    return requestUrl;
  }

  return (dispatch, getState) => {
    // Check if current request for exact requestUrl.  Don't allow concurrent requests for the same thing.
    const urlRequest = getState().urlRequests[requestUrl];
    if (urlRequest && urlRequest.actionType === URLREQUEST) {
      // Return the current request promise.
      return urlRequest.request;
    }

    // If a GET request, and cached, return the cached response.
    if (method.toLowerCase() === 'get') {
      const cachedGetRequest = cachedGetRequests[requestUrl];
      if (cachedGetRequest) {
        dispatch({
          type: URLREQUEST,
          payload: { requestUrl, request: cachedGetRequest.request, ...cachedGetRequest.reduxState }
        });
        dispatch({
          type: URLREQUEST_SUCCESS,
          payload: { requestUrl, ...cachedGetRequest.reduxState }
        });
        dispatch(clearUrlRequest(requestUrl));
        return Promise.resolve(cachedGetRequest.response);
      }
    }

    // Do the request.
    const request = axios({ method, url: requestUrl, headers, data })
      .then((response) => { // eslint-disable-line no-unused-vars
        // Cache GET requests.
        if (method.toLowerCase() === 'get') {
          cachedGetRequests[requestUrl] = { response, request, reduxState };
        }

        dispatch({
          type: URLREQUEST_SUCCESS,
          payload: { requestUrl, ...reduxState }
        });
        dispatch(clearUrlRequest(requestUrl));
        return response;
      })
      .catch((err) => {
        dispatch({
          type: URLREQUEST_ERROR,
          payload: err,
          error: true,
          errorMeta: { requestUrl, ...reduxState }
        });
        dispatch(clearUrlRequest(requestUrl));
        throw err;
      });

    dispatch({
      type: URLREQUEST,
      payload: { requestUrl, request, ...reduxState }
    });

    return request;
  };
};

export const doAuthenticatedRequest = ({ requestUrl, method, additionalHeaders, data }, reduxState, getKey = false) => {
  const secureHeaders = additionalHeaders || {};
  secureHeaders.Authorization = `Bearer ${config.jwt}`;
  return doRequest({ requestUrl, method, headers: secureHeaders, data }, reduxState, getKey);
};


let _online = false;
export const onlineOfflineListener = (online) => {
  // When back online after being offline.
  if ((online) && (!_online)) {
    Object.keys(cachedGetRequests).forEach((requestUrl) => {
      const { reduxState } = cachedGetRequests[requestUrl];
      delete cachedGetRequests[requestUrl];
      doAuthenticatedRequest({
        requestUrl,
        method: 'get'
      }, reduxState);
    });
  }
  _online = online;
};
