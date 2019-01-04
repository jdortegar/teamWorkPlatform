import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const LWREPORTS_PLANTUPTIME_FETCH_SUCCESS = 'lwReports/plantUptime/fetch/success';

export const fetchPlantUptimeReport = params => {
  let requestUrl = buildApiUrl('reports/lamb-weston/report-a');

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
        const { categories, series, measure } = response.data.report;
        dispatch({
          type: LWREPORTS_PLANTUPTIME_FETCH_SUCCESS,
          payload: { categories, series, measure }
        });
      }
      return response;
    });

    return thunk;
  };
};
