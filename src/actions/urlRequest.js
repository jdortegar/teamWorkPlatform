import axios from 'axios';
import { getJwt } from '../session';

export const URLREQUEST = 'urlrequest';
export const URLREQUEST_SUCCESS = 'urlrequest/success';
export const URLREQUEST_ERROR = 'urlrequest/error';
export const URLREQUEST_CLEAR = 'urlrequest/clear';

export const clearUrlRequest = (requestUrl) => {
  return {
    type: URLREQUEST_CLEAR,
    payload: { requestUrl }
  };
};

export const doRequest = ({ requestUrl, method, headers, data }, reduxState, getKey) => {
  if (getKey) {
    return requestUrl;
  }

  return (dispatch, getState) => {
    // Check if current request for exact requestUrl.
    const urlRequest = getState().urlRequests[requestUrl];
    if (urlRequest && urlRequest.actionType === URLREQUEST) {
      // Return the current request promise.
      return urlRequest.request;
    }

    // Do the request.
    const request = axios({ method, url: requestUrl, headers, data })
      .then((response) => { // eslint-disable-line no-unused-vars
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

export const doAuthenticatedRequest = ({ requestUrl, method, additionalHeaders, data }, reduxState, getKey) => {
  const secureHeaders = additionalHeaders || {};
  secureHeaders.Authorization = `Bearer ${getJwt()}`;
  return doRequest({ requestUrl, method, headers: secureHeaders, data }, reduxState, getKey);
};
