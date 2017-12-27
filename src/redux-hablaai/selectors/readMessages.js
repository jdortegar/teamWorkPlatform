import createCachedSelector from 're-reselect';
import { getReadMessagesByConversationId } from './state';

export {
  getReadMessagesByConversationId
} from './state';

export const getReadMessagesOfConversationId = createCachedSelector(
  [getReadMessagesByConversationId, (state, conversationId) => conversationId],
  (readMessagesOfConversationId, conversationId) => {
    return readMessagesOfConversationId[conversationId];
  }
)(
  (state, conversationId) => conversationId
);
