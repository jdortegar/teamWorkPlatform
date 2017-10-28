import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ChatContent from '../../components/ChatContent';
import { getInvitations } from '../../selectors';

function mapStateToProps(state) {
  return {
    invitation: getInvitations(state)
  };
}

export default withRouter(connect(mapStateToProps)(ChatContent));
