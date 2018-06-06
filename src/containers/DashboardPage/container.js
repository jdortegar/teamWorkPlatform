import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import DashboardPage from 'pages/DashboardPage';
import { getCurrentSubscriberOrgId } from 'selectors';

const mapStateToProps = (state, ownProps) => {
  const reportId = ownProps.match.params.reportId;
  return {
    reportId,
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
    reports: state.dashboard.reports,
    selectedReport: state.dashboard.reports[reportId]
  };
};

export default withRouter(connect(mapStateToProps)(DashboardPage));
