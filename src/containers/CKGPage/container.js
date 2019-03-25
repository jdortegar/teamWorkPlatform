import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CKGPage } from 'src/pages';

export default withRouter(connect()(CKGPage));
