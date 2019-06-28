import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getUserById, getTeam, getConversationLink, getConversationsById, getUserByUserId } from 'src/selectors';
import { MessageResult } from 'src/components';

const mapStateToProps = (state, props) => {
  const conversationsId = getConversationsById(state);
  const usersObj = getUserByUserId(state);
  return {
    sender: getUserById(state, props.message.createdBy),
    team: getTeam(state, conversationsId[props.message.conversationId].appData.teamId),
    link: getConversationLink(state, props.message.conversationId),
    members: conversationsId[props.message.conversationId].members || '',
    users: Object.values(usersObj)
  };
};

export default withRouter(connect(mapStateToProps)(MessageResult));
