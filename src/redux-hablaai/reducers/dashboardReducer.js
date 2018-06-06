import { TIMEACTIVITIES_FETCH_SUCCESS } from '../actions';

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
    plantUpMultipleComparisons: {
      breadcrumb: 'dashboardPage.plantUpMultipleComparisonsBreadcrumb'
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
    case TIMEACTIVITIES_FETCH_SUCCESS:
      return state;
    default:
      return state;
  }
};

export default dashboardReducer;
