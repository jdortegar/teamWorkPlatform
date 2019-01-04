import { buildApiUrl } from 'src/lib/api';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const LWREPORTS_DAILYPLANTUPTIME_FETCH_SUCCESS = 'lwReports/dailyPlantUptime/fetch/success';

export const fetchDailyPlantUptimeReport = params => {
  let requestUrl = buildApiUrl('reports/lamb-weston/report-b');

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
          type: LWREPORTS_DAILYPLANTUPTIME_FETCH_SUCCESS,
          payload: { title, series, measure }
        });
      }
      return response;
    });

    return thunk;
  };
};
