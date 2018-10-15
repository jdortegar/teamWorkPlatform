import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ChatContent } from 'src/components';
import { getInvitations } from 'src/selectors';

const mapStateToProps = state => ({
  invitation: getInvitations(state)
});

export default withRouter(connect(mapStateToProps)(ChatContent));
