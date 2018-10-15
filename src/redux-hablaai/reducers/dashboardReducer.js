import {
  LWREPORTS_PLANTUPTIME_FETCH_SUCCESS,
  LWREPORTS_DAILYPLANTUPTIME_FETCH_SUCCESS,
  LWREPORTS_PLANTUPTIMEMULTIPLE_FETCH_SUCCESS,
  LWREPORTS_DOWNTIMEREASONSLEVELONE_FETCH_SUCCESS,
  LWREPORTS_DOWNTIMECOMPARISONMULTIPLE_FETCH_SUCCESS
} from 'src/actions';

const INITIAL_STATE = {
  reports: {
    plantUptime: {
      breadcrumb: 'dashboardPage.plantUptimeByLineAndStringBreadcrumb',
      categories: [],
      series: [],
      measure: 'minutes'
    },
    dailyPlantUptime: {
      breadcrumb: 'dashboardPage.dailyPlantUptimeBreadcrumb',
      series: [],
      measure: 'minutes'
    },
    plantUptimeMultiple: {
      breadcrumb: 'dashboardPage.plantUptimeMultipleBreadcrumb',
      series: [],
      measure: 'minutes'
    },
    downtimeReasonsLevelOne: {
      breadcrumb: 'dashboardPage.downtimeReasonsLevelOneBreadcrumb',
      series: [],
      measure: 'minutes'
    },
    downtimeComparisonMultiple: {
      breadcrumb: 'dashboardPage.downtimeComparisonMultipleBreadcrumb',
      categories: [],
      series: [],
      measure: 'minutes'
    }
  }
};

const dashboardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LWREPORTS_PLANTUPTIME_FETCH_SUCCESS: {
      const { categories, series, measure } = action.payload;
      return {
        ...state,
        reports: {
          ...state.reports,
          plantUptime: {
            ...state.reports.plantUptime,
            categories,
            series,
            measure
          }
        }
      };
    }
    case LWREPORTS_DAILYPLANTUPTIME_FETCH_SUCCESS: {
      const { series, measure } = action.payload;
      return {
        ...state,
        reports: {
          ...state.reports,
          dailyPlantUptime: {
            ...state.reports.dailyPlantUptime,
            series,
            measure
          }
        }
      };
    }
    case LWREPORTS_PLANTUPTIMEMULTIPLE_FETCH_SUCCESS: {
      const { series, measure } = action.payload;
      return {
        ...state,
        reports: {
          ...state.reports,
          plantUptimeMultiple: {
            ...state.reports.plantUptimeMultiple,
            series,
            measure
          }
        }
      };
    }
    case LWREPORTS_DOWNTIMEREASONSLEVELONE_FETCH_SUCCESS: {
      const { series, measure } = action.payload;
      return {
        ...state,
        reports: {
          ...state.reports,
          downtimeReasonsLevelOne: {
            ...state.reports.downtimeReasonsLevelOne,
            series,
            measure
          }
        }
      };
    }
    case LWREPORTS_DOWNTIMECOMPARISONMULTIPLE_FETCH_SUCCESS: {
      const { categories, series, measure } = action.payload;
      return {
        ...state,
        reports: {
          ...state.reports,
          downtimeComparisonMultiple: {
            ...state.reports.downtimeComparisonMultiple,
            categories,
            series,
            measure
          }
        }
      };
    }
    default:
      return state;
  }
};

export default dashboardReducer;
