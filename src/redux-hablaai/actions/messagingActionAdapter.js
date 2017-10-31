import config from '../config';
import EventTypes from '../../common-hablaai/EventTypes';
import {
  changePresence,
  receiveUser,
  receiveSubscriberOrg,
  receiveSubscriber,
  receiveTeam,
  receiveTeamMember,
  receiveTeamRoom,
  receiveTeamRoomMember,
  receiveInvitation,
  receiveConversations,
  receiveMessages,
  receiveTyping,
  updateIntegrations
} from '../actions';

const eventHandler = (eventType, event) => {
  switch (eventType) {
    case EventTypes.presenceChanged:
      config.store.dispatch(changePresence(event));
      break;
    case EventTypes.userInvited:
      config.store.dispatch(receiveInvitation(event));
      break;
    case EventTypes.userCreated:
      // Don't care about this.  This is when a new user registers.  Also, notification won't be sent for this, currently.
      break;
    case EventTypes.userUpdated:
      config.store.dispatch(receiveUser(event));
      break;
    case EventTypes.userPrivateInfoUpdated:
      config.store.dispatch(receiveUser(event)); // Same as userUpdated except contains preferences.private.
      break;

    case EventTypes.subscriberOrgCreated:
      config.store.dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgUpdated:
      config.store.dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgPrivateInfoUpdated:
      config.store.dispatch(receiveSubscriberOrg(event)); // Same as subscriberOrgUpdated except contains preferences.private.
      break;
    case EventTypes.subscriberAdded:
      config.store.dispatch(receiveSubscriber(event.user, event.subscriberOrgId));
      break;

    case EventTypes.teamCreated:
      config.store.dispatch(receiveTeam(event));
      break;
    case EventTypes.teamUpdated:
      config.store.dispatch(receiveTeam(event));
      break;
    case EventTypes.teamPrivateInfoUpdated:
      config.store.dispatch(receiveTeam(event)); // Same as teamUpdated except contains preferences.private.
      break;
    case EventTypes.teamMemberAdded:
      config.store.dispatch(receiveTeamMember(event.user, event.teamId));
      break;

    case EventTypes.teamRoomCreated:
      config.store.dispatch(receiveTeamRoom(event, event.teamId));
      break;
    case EventTypes.teamRoomUpdated:
      config.store.dispatch(receiveTeamRoom(event, event.teamId));
      break;
    case EventTypes.teamRoomPrivateInfoUpdated:
      config.store.dispatch(receiveTeamRoom(event, event.teamId)); // Same as teamRoomUpdated except contains preferences.private.
      break;
    case EventTypes.teamRoomMemberAdded:
      config.store.dispatch(receiveTeamRoomMember(event.user, event.teamRoomId));
      break;

    case EventTypes.conversationCreated:
      config.store.dispatch(receiveConversations([event]));
      break;
    case EventTypes.conversationUpdated:
      config.store.dispatch(receiveConversations([event])); // Same as conversationCreated.
      break;

    case EventTypes.messageCreated:
      config.store.dispatch(receiveMessages([event], event.conversationId));
      break;
    case EventTypes.typing:
      config.store.dispatch(receiveTyping([event]));
      break;

    case EventTypes.integrationsUpdated:
      config.store.dispatch(updateIntegrations(event.userId, event.subscriberOrgId, event.integrations));
      break;

    default:
      return false;
  }
  return true;
};

export default eventHandler;
