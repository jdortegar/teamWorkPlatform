import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CKGPage } from 'src/pages';
import { getCurrentSubscriberOrgId } from 'src/selectors';

const mapStateToProps = state => ({
  orgId: getCurrentSubscriberOrgId(state)
});

export default withRouter(connect(mapStateToProps)(CKGPage));
