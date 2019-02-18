import { connect } from 'react-redux';
import {
  getCurrentSubscriberOrg,
  getCurrentUser,
  getUserByUserId,
  getPresencesOfSubscribersOfOrgId,
  getCurrentSubscriberOrgId,
  getCurrentPersonalConversation,
  getReadMessagesByConversationId,
  getConversationById,
  getTranscriptByConversationId
} from 'src/selectors';
import { createConversation, makePersonalCall, readMessage } from 'src/actions';
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
    conversations: getConversationById(state),
    transcripts: getTranscriptByConversationId(state)
  };
};

const mapDispatchToProps = {
  createConversation,
  makePersonalCall,
  readMessage
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectMessagesPage);
