import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getConversation, getCurrentUserId } from 'src/selectors';
import { Bookmark } from 'src/components';

const mapStateToProps = (state, props) => {
  const currentUserId = getCurrentUserId(state);
  const conversation = getConversation(state, props.message.conversationId) || {};
  const { appData = {}, members = [] } = conversation;
  const { teamId } = appData;
  const memberId = members.find(item => item !== currentUserId);

  return { teamId, memberId };
};

export default withRouter(connect(mapStateToProps)(Bookmark));
