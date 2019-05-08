import { connect } from 'react-redux';
import {
  getCurrentUser,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrgId,
  getPersonalConversation,
  areConversationsLoaded
} from 'src/selectors';
import { fetchConversations, createConversation, makePersonalCall } from 'src/actions';
import { DirectMessagesPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { userId } = props.match.params;
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    userId,
    currentUser: getCurrentUser(state),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    conversation: getPersonalConversation(state, userId),
    conversationsLoaded: areConversationsLoaded(state)
  };
};

const mapDispatchToProps = {
  fetchConversations,
  createConversation,
  makePersonalCall
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectMessagesPage);
