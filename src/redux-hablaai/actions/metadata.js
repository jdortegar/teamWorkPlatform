import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest } from './urlRequest';

// eslint-disable-next-line import/prefer-default-export
export const fetchMetadata = url => {
  const requestUrl = buildApiUrl(`metadata?url=${url}`, 'v2');

  return doAuthenticatedRequest({
    requestUrl,
    method: 'get'
  });
};
