import EventTypes from 'src/common-hablaai/EventTypes';
import { changePresence } from './presenceChange';
import { receiveUser } from './userReceive';
import { receiveSubscriberOrg } from './subscriberOrgReceive';
import { receiveSubscriber } from './subscriberReceive';
import { receiveTeam } from './teamReceive';
import { receiveTeamMember } from './teamMemberReceive';
import { receiveInvitation } from './invitationReceive';
import { declinedInvitation } from './invitationDeclined';
import { receiveConversations } from './conversationsReceive';
import { receiveMessages } from './messagesReceive';
import { receiveReadMessages } from './readMessagesReceive';
import { receiveTyping } from './typing';
import { receiveCall, receiveCallAnswer, receiveTeamCall, receiveTeamCallAnswer } from './callings';
import { updateIntegrations } from './integrations';

// eslint-disable-next-line import/prefer-default-export
export const eventHandler = dispatch => (eventType, event) => {
  switch (eventType) {
    case EventTypes.presenceChanged:
      dispatch(changePresence(event));
      break;
    case EventTypes.userInvited:
      dispatch(receiveInvitation(event));
      break;
    case EventTypes.userCreated:
      dispatch(receiveUser(event));
      break;
    case EventTypes.userUpdated:
      dispatch(receiveUser(event));
      break;
    case EventTypes.userPrivateInfoUpdated:
      dispatch(receiveUser(event)); // Same as userUpdated except contains preferences.private.
      break;
    case EventTypes.userBookmarksUpdated:
      Object.values(event.messages).forEach(message => {
        dispatch(receiveMessages([message], message.conversationId));
      });
      break;
    // case EventTypes.userInvitationAccepted:
    //   // TODO:
    //   break;
    case EventTypes.userInvitationDeclined:
      dispatch(declinedInvitation(event));
      break;
    // case EventTypes.sentInvitationStatus:
    //   // TODO:
    //   break;

    case EventTypes.subscriberOrgCreated:
      dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgUpdated:
      dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgPrivateInfoUpdated:
      dispatch(receiveSubscriberOrg(event)); // Same as subscriberOrgUpdated except contains preferences.private.
      break;
    case EventTypes.subscriberAdded:
      dispatch(receiveSubscriber(event.user, event.subscriberOrgId));
      break;
    case EventTypes.teamCreated:
      dispatch(receiveTeam(event));
      break;
    case EventTypes.teamUpdated:
      dispatch(receiveTeam(event));
      break;
    case EventTypes.teamPrivateInfoUpdated:
      dispatch(receiveTeam(event)); // Same as teamUpdated except contains preferences.private.
      break;
    case EventTypes.teamMemberAdded:
      dispatch(receiveTeamMember(event.user, event.teamId));
      break;

    case EventTypes.conversationCreated:
      dispatch(receiveConversations([event]));
      break;
    case EventTypes.conversationUpdated:
      dispatch(receiveConversations([event])); // Same as conversationCreated.
      break;

    case EventTypes.messageCreated:
      dispatch(receiveMessages([event], event.conversationId));
      break;
    case EventTypes.messageRead:
      dispatch(receiveReadMessages(event));
      break;
    case EventTypes.messageUpdated:
      dispatch(receiveMessages([event], event.conversationId));
      break;
    case EventTypes.messageDeleted:
    case EventTypes.messageLiked:
    case EventTypes.messageDisliked:
    case EventTypes.messageFlagged:
      dispatch(receiveMessages([event], event.conversationId));
      break;
    case EventTypes.typing:
      dispatch(receiveTyping(event));
      break;
    case EventTypes.makePersonalCall:
      dispatch(receiveCall(event));
      break;
    case EventTypes.answerCall:
      dispatch(receiveCallAnswer(event));
      break;
    case EventTypes.makeTeamCall:
      dispatch(receiveTeamCall(event));
      break;
    case EventTypes.answerTeamCall:
      dispatch(receiveTeamCallAnswer(event));
      break;
    case EventTypes.integrationsUpdated:
      dispatch(updateIntegrations(event.userId, event.subscriberOrgId, event.integrations));
      break;

    default:
      return false;
  }
  return true;
};
