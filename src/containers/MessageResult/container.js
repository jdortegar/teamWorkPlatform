import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getUserById, getTeam, getConversationLink, getConversationsById, getUserByUserId } from 'src/selectors';
import { fetchMessage } from 'src/actions';
import { MessageResult } from 'src/components';

const mapStateToProps = (state, props) => {
  const conversationsId = getConversationsById(state);
  const usersObj = getUserByUserId(state);
  let team;
  let members;
  let sender;
  let link;

  if (props.message) {
    team = getTeam(state, conversationsId[props.message.conversationId].appData.teamId);
    // eslint-disable-next-line prefer-destructuring
    members = conversationsId[props.message.conversationId].members;
    sender = getUserById(state, props.message.createdBy);
    link = getConversationLink(state, props.message.conversationId);
  }

  return {
    team,
    members,
    sender,
    link,
    users: Object.values(usersObj)
  };
};

const mapDispatchToProps = {
  fetchMessage
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MessageResult)
);
