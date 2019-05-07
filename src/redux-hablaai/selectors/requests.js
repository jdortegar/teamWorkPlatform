import { createSelector } from 'reselect';

export const getUrlRequests = state => state.urlRequests;

export const getUrlRequestStatus = createSelector(
  [getUrlRequests, (state, requestUrl) => requestUrl],
  (urlRequests, requestUrl) => urlRequests[requestUrl]
);

export { getRequests, getResponseRequests } from './state';
