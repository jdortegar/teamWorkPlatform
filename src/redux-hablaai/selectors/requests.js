import createCachedSelector from 're-reselect';
import { getUrlRequests } from './state';

export { getUrlRequests } from './state';

export const getUrlRequestStatus = createCachedSelector(
  [getUrlRequests, (state, requestUrl) => requestUrl],
  (urlRequests, requestUrl) => {
    return urlRequests[requestUrl];
  }
)((state, requestUrl) => requestUrl);
