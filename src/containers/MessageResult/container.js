import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getUserById, getTeam } from 'src/selectors';
import { MessageResult } from 'src/components';

const mapStateToProps = (state, props) => ({
  sender: getUserById(state, props.message.createdBy),
  team: getTeam(state, props.message.teamId)
});

export default withRouter(connect(mapStateToProps)(MessageResult));
