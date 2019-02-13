import { connect } from 'react-redux';
import {
  getCurrentSubscriberOrg,
  getCurrentUser,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrgId,
  getCurrentPersonalConversation,
  getReadMessagesByConversationId,
  getConversationById
} from 'src/selectors';
import { createConversation, makePersonalCall } from 'src/actions';
import { DirectMessagesPage } from 'src/pages';

const mapStateToProps = (state, props) => {
  const { userId } = props.match.params;
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    org: getCurrentSubscriberOrg(state),
    user: getCurrentUser(state),
    users: getUserByUserId(state),
    usersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    currentPersonalConversation: getCurrentPersonalConversation(state),
    readMessagesByConversationId: getReadMessagesByConversationId(state),
    userId,
    conversations: getConversationById(state)
  };
};

const mapDispatchToProps = {
  createConversation,
  makePersonalCall
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectMessagesPage);
