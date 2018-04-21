import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import DashboardPage from 'pages/DashboardPage';
import { getCurrentSubscriberOrgId } from 'selectors';

const mapStateToProps = state => ({
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
});

export default withRouter(connect(mapStateToProps)(DashboardPage));
