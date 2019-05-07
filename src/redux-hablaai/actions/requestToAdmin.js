import { buildApiUrl } from 'src/lib/api';
import { getCurrentOrgId } from 'src/selectors';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const REQUEST_UPDATE = 'request/update';
export const REQUEST_RECEIVE = 'request/receive';
export const REQUEST_RESPONSE = 'request/response';
export const REQUESTS_FETCH_SUCCESS = 'request/fetch/success';

export const receiveRequest = request => ({
  type: REQUEST_RECEIVE,
  payload: { request }
});

export const responseRequest = request => ({
  type: REQUEST_RESPONSE,
  payload: { request }
});

export const requestResponse = (responseObj, requestObj) => (dispatch, getState) => {
  const orgId = getCurrentOrgId(getState());
  const { teamId } = requestObj;
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/${teamId}/joinRequests/`, 'v2');
  const requestObject = {
    ...requestObj,
    ...responseObj
  };

  const thunk = dispatch(
    doAuthenticatedRequest(
      {
        requestUrl,
        method: 'patch',
        data: requestObject
      },
      { requestObject }
    )
  );

  thunk.then(response => {
    if (response.data && response.data !== RESPONSE_STALE) {
      const { request } = response.data;
      dispatch({
        type: REQUEST_UPDATE,
        payload: { request }
      });
    }
    return response;
  });

  return thunk;
};

export const fetchRequests = () => (dispatch, getState) => {
  const orgId = getCurrentOrgId(getState());
  const requestUrl = buildApiUrl(`organization/${orgId}/teams/joinRequests/`, 'v2');
  const thunk = dispatch(
    doAuthenticatedRequest({
      requestUrl,
      method: 'get'
    })
  );

  thunk.then(response => {
    const { requests } = response.data;
    dispatch({
      type: REQUESTS_FETCH_SUCCESS,
      payload: { requests }
    });
    return requests;
  });

  return thunk;
};
