import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { UserDnD } from 'src/components';
import { getPersonalConversation } from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { userId } = props.user;
  const conversation = getPersonalConversation(state, userId) || {};
  return {
    conversationId: conversation.id
  };
};

export default withRouter(connect(mapStateToProps)(UserDnD));
