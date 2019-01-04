import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const LWREPORTS_DOWNTIMEREASONSLEVELONE_FETCH_SUCCESS = 'lwReports/downtimeReasonsLevelOne/fetch/success';

export const fetchDowntimeReasonsLevelOneReport = params => {
  let requestUrl = buildApiUrl('reports/lamb-weston/report-d');

  const paramsString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  requestUrl += `?${paramsString}`;

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        params
      )
    );

    thunk.then(response => {
      if (response.data && response.data !== RESPONSE_STALE) {
        const { title, series, measure } = response.data.report;
        dispatch({
          type: LWREPORTS_DOWNTIMEREASONSLEVELONE_FETCH_SUCCESS,
          payload: { title, series, measure }
        });
      }
      return response;
    });

    return thunk;
  };
};
