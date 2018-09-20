import config from 'src/config/env';
import { doAuthenticatedRequest, RESPONSE_STALE } from './urlRequest';

export const LWREPORTS_PLANTUPTIMEMULTIPLE_FETCH_SUCCESS = 'lwReports/plantUptimeMultiple/fetch/success';

export const fetchPlantUptimeMultipleReport = (params, options = { getKey: false, forceGet: true }) => {
  let requestUrl = `${config.hablaApiBaseUri}/reports/lamb-weston/report-c`;

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
          const { title, series, measure } = response.data.report;
          dispatch({
            type: LWREPORTS_PLANTUPTIMEMULTIPLE_FETCH_SUCCESS,
            payload: { title, series, measure }
          });
        }
        return response;
      });
    }

    return thunk;
  };
};
