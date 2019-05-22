import EventTypes from 'src/common-hablaai/EventTypes';
import { fetchConversations } from './conversations';
import { changePresence } from './presenceChange';
import { receiveUser } from './userReceive';
import { receiveSubscriberOrg } from './subscriberOrgReceive';
import { receiveSubscriber } from './subscriberReceive';
import { receiveTeam, receivePublicTeam } from './teamReceive';
import { receiveTeamMember } from './teamMemberReceive';
import { receiveInvitation } from './invitationReceive';
import { declinedInvitation } from './invitationDeclined';
import { receiveConversations } from './conversationsReceive';
import { receiveMessage, receiveMessageDeleted } from './messageReceive';
import { receiveTyping } from './typing';
import { receiveCall, receiveCallAnswer, receiveTeamCall, receiveTeamCallAnswer } from './callings';
import { updateIntegrations } from './integrations';
import { receiveRequest, responseRequest } from './requestToAdmin';

// eslint-disable-next-line import/prefer-default-export
export const eventHandler = dispatch => (eventType, event) => {
  if (eventType !== EventTypes.presenceChanged) console.warn({ eventType, event }); // eslint-disable-line
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
        dispatch(receiveMessage(message, message.conversationId));
      });
      break;
    case EventTypes.userInvitationAccepted:
      // TODO:
      break;
    case EventTypes.userInvitationDeclined:
      dispatch(declinedInvitation(event));
      break;
    case EventTypes.sentInvitationStatus:
      // TODO:
      break;
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
    case EventTypes.teamCreated: {
      dispatch(receiveTeam(event));
      dispatch(fetchConversations());
      break;
    }
    case EventTypes.publicTeamCreated:
      dispatch(receivePublicTeam(event));
      break;
    case EventTypes.teamUpdated:
      dispatch(receiveTeam(event));
      break;
    case EventTypes.teamPrivateInfoUpdated:
      dispatch(receiveTeam(event)); // Same as teamUpdated except contains preferences.private.
      break;
    case EventTypes.teamMemberAdded: {
      dispatch(receiveTeamMember(event.user, event.teamId));
      dispatch(fetchConversations());
      break;
    }
    case EventTypes.conversationCreated:
    case EventTypes.conversationUpdated:
      dispatch(receiveConversations([event]));
      break;
    case EventTypes.messageCreated:
    case EventTypes.messageUpdated:
      dispatch(receiveMessage(event));
      break;
    case EventTypes.messageDeleted:
      dispatch(receiveMessageDeleted(event));
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
    case EventTypes.requestToAdmin:
      dispatch(receiveRequest(event));
      break;
    case EventTypes.requestResponse:
      dispatch(responseRequest(event));
      break;
    default:
      return false;
  }
  return true;
};
