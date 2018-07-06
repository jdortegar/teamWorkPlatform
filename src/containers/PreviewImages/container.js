import { connect } from 'react-redux';

import { PreviewImages } from 'components';
import { getToken } from 'selectors';

const mapStateToProps = state => ({
  token: getToken(state)
});

export default connect(mapStateToProps)(PreviewImages);
