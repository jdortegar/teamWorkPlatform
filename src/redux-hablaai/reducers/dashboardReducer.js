import _ from 'lodash';

import { LW_PLANTUPTIMEREPORT_FETCH_SUCCESS } from '../actions';

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
    case LW_PLANTUPTIMEREPORT_FETCH_SUCCESS: {
      const { categories, series, measure } = action.payload;
      return _.merge(state, { reports: { plantUptime: { categories, series, measure } } });
    }
    default:
      return state;
  }
};

export default dashboardReducer;
