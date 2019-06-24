import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getUserById, getTeam, getConversationLink, getConversationsById } from 'src/selectors';
import { MessageResult } from 'src/components';

const mapStateToProps = (state, props) => {
  const conversationsId = getConversationsById(state);

  return {
    sender: getUserById(state, props.message.createdBy),
    team: getTeam(state, props.message.teamId),
    link: getConversationLink(state, props.message.conversationId),
    conversationDescription: conversationsId[props.message.conversationId].description || ''
  };
};

export default withRouter(connect(mapStateToProps)(MessageResult));
