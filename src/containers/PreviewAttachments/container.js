import { connect } from 'react-redux';

import { getToken, getCurrentOrgId } from 'src/selectors';
import { PreviewAttachments } from 'src/components';

const mapStateToProps = state => ({
  orgId: getCurrentOrgId(state),
  token: getToken(state)
});

export default connect(mapStateToProps)(PreviewAttachments);
