import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import DashboardPage from 'pages/DashboardPage';
import { getCurrentSubscriberOrgId } from 'selectors';
import {
  fetchPlantUptimeReport,
  fetchDailyPlantUptimeReport,
  fetchPlantUptimeMultipleReport,
  fetchDowntimeReasonsLevelOneReport
} from 'actions';

const mapStateToProps = (state, ownProps) => {
  const reportId = ownProps.match.params.reportId;

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
  fetchDowntimeReasonsLevelOneReport: params => dispatch(fetchDowntimeReasonsLevelOneReport(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardPage)
);
