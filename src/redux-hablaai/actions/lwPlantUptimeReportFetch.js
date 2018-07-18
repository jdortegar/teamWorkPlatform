import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';
import config from '../../config/env';

export const LWREPORTS_PLANTUPTIME_FETCH_SUCCESS = 'lwReports/plantUptime/fetch/success';

export const fetchPlantUptimeReport = (params, options = { getKey: false, forceGet: true }) => {
  let requestUrl = `${config.hablaApiBaseUri}/reports/lamb-weston/report-a`;

  const paramsString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  requestUrl += `?${paramsString}`;

  // Passthrough data that you'll see after going through the reducer.  Typically in you mapStateToProps.
  const reduxState = { ...params };

  return dispatch => {
    const thunk = dispatch(
      doAuthenticatedRequest(
        {
          requestUrl,
          method: 'get'
        },
        reduxState,
        options
      )
    );

    if (!options.getKey) {
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
    }

    return thunk;
  };
};
