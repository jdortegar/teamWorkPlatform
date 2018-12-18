import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const LWREPORTS_DOWNTIMECOMPARISONMULTIPLE_FETCH_SUCCESS = 'lwReports/downtimeComparisonMultiple/fetch/success';

export const fetchDowntimeComparisonMultipleReport = params => {
  let requestUrl = buildApiUrl('reports/lamb-weston/report-e');

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
        const { title, categories, series, measure } = response.data.report;
        dispatch({
          type: LWREPORTS_DOWNTIMECOMPARISONMULTIPLE_FETCH_SUCCESS,
          payload: { title, categories, series, measure }
        });
      }
      return response;
    });

    return thunk;
  };
};
