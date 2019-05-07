import { connect } from 'react-redux';

import { getUnreadMessages, getPersonalConversation } from 'src/selectors';
import { DirectMessageItem } from 'src/components';

const mapStateToProps = (state, props) => {
  const { userId } = props.user;
  const conversation = getPersonalConversation(state, userId) || {};

  return {
    unreadMessages: getUnreadMessages(state, conversation.id)
  };
};

export default connect(mapStateToProps)(DirectMessageItem);
