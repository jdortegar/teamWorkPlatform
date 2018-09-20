import { connect } from 'react-redux';

import { getToken } from 'src/selectors';
import { PreviewImages } from 'src/components';

const mapStateToProps = state => ({
  token: getToken(state)
});

export default connect(mapStateToProps)(PreviewImages);
