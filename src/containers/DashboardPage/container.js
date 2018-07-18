import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import DashboardPage from 'pages/DashboardPage';
import { getCurrentSubscriberOrgId } from 'selectors';
import {
  fetchPlantUptimeReport,
  fetchDailyPlantUptimeReport,
  fetchPlantUptimeMultipleReport,
  fetchDowntimeReasonsLevelOneReport,
  fetchDowntimeComparisonMultipleReport
} from 'actions';

const mapStateToProps = (state, ownProps) => {
  const { reportId } = ownProps.match.params;

  return {
    reportId,
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
    reports: state.dashboard.reports,
    selectedReport: state.dashboard.reports[reportId]
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPlantUptimeReport: params => dispatch(fetchPlantUptimeReport(params)),
  fetchDailyPlantUptimeReport: params => dispatch(fetchDailyPlantUptimeReport(params)),
  fetchPlantUptimeMultipleReport: params => dispatch(fetchPlantUptimeMultipleReport(params)),
  fetchDowntimeReasonsLevelOneReport: params => dispatch(fetchDowntimeReasonsLevelOneReport(params)),
  fetchDowntimeComparisonMultipleReport: params => dispatch(fetchDowntimeComparisonMultipleReport(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardPage)
);
