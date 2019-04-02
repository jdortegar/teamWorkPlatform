import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getUserById } from 'src/selectors';
import { MessageResult } from 'src/components';

const mapStateToProps = (state, props) => ({
  sender: getUserById(state, props.message.createdBy)
});

export default withRouter(connect(mapStateToProps)(MessageResult));
