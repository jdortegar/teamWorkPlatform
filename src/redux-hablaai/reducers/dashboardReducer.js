import {
  LWREPORTS_PLANTUPTIME_FETCH_SUCCESS,
  LWREPORTS_PLANTUPTIMEMULTIPLE_FETCH_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  reports: {
    plantUptime: {
      breadcrumb: 'dashboardPage.plantUptimeByLineAndStringBreadcrumb',
      categories: [],
      series: [],
      measure: 'minutes'
    },
    dailyPlantUptime: {
      breadcrumb: 'dashboardPage.dailyPlantUptimeBreadcrumb'
    },
    plantUptimeMultiple: {
      breadcrumb: 'dashboardPage.plantUptimeMultipleBreadcrumb',
      series: [],
      measure: 'minutes'
    },
    downtimeReasonLevelOne: {
      breadcrumb: 'dashboardPage.downtimeReasonsLevelOneBreadcrumb'
    },
    downtimeComparisonMultiplePlants: {
      breadcrumb: 'dashboardPage.downtimeComparisonMultiplePlantsBreadcrumb'
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
    default:
      return state;
  }
};

export default dashboardReducer;
