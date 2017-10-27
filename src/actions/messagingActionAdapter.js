import config from '../redux-hablaai/config';
import EventTypes from '../common-hablaai/EventTypes';
import {
  receiveSubscriberOrg,
  receiveSubscriber,
  receiveTeam,
  receiveTeamMember,
  receiveTeamRoom,
  receiveTeamRoomMember
} from '../actions';
import { receiveInvitation } from './invitations';
import { receiveConversations, receiveMessages, notifyMessage } from './conversations';

// TODO: compare these event types.
export default function (eventType, event) {
  switch (eventType) {
    case EventTypes.presenceChanged:
      // TODO:
      break;
    case EventTypes.userInvited:
      config.store.dispatch(receiveInvitation(event));
      break;
    case EventTypes.userUpdated:
      // TODO:
      break;
    case EventTypes.userPrivateInfoUpdated:
      // TODO:
      break;

    case EventTypes.subscriberOrgCreated:
      config.store.dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgUpdated:
      config.store.dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgPrivateInfoUpdated:
      // TODO:
      break;
    case EventTypes.subscriberAdded:
      // TODO: implement this whole process all the way to action -> reducer -> selectors.
      config.store.dispatch(receiveSubscriber(event, event.subscriberOrgId));
      break;

    case EventTypes.teamCreated:
      config.store.dispatch(receiveTeam(event));
      break;
    case EventTypes.teamUpdated:
      config.store.dispatch(receiveTeam(event));
      break;
    case EventTypes.teamPrivateInfoUpdated:
      // TODO:
      break;
    case EventTypes.teamMemberAdded:
      // TODO: implement this whole process all the way to action -> reducer -> selectors.
      config.store.dispatch(receiveTeamMember(event, event.teamId));
      break;

    case EventTypes.teamRoomCreated:
      config.store.dispatch(receiveTeamRoom(event, event.teamId));
      break;
    case EventTypes.teamRoomUpdated:
      config.store.dispatch(receiveTeamRoom(event, event.teamId));
      break;
    case EventTypes.teamRoomPrivateInfoUpdated:
      // TODO:
      break;
    case EventTypes.teamRoomMemberAdded:
      // TODO: implement this whole process all the way to action -> reducer -> selectors.
      config.store.dispatch(receiveTeamRoomMember(event, event.teamRoomId));
      break;

    case EventTypes.conversationCreated:
      config.store.dispatch(receiveConversations([event], event.teamRoomId));
      break;
    case EventTypes.conversationUpdated:
      // TODO:
      break;
    case EventTypes.messageCreated:
      config.store.dispatch(receiveMessages([event], event.conversationId));
      config.store.dispatch(notifyMessage(event));
      break;

    case EventTypes.boxIntegrationCreated:
      // TODO;
      break;
    case EventTypes.boxIntegrationExpired:
      // TODO:
      break;
    case EventTypes.boxIntegrationRevoked:
      // TODO:
      break;
    case EventTypes.googleIntegrationCreated:
      // TODO;
      break;
    case EventTypes.googleIntegrationExpired:
      // TODO:
      break;
    case EventTypes.googleIntegrationRevoked:
      // TODO:
      break;

    default:
      console.log(`Unprocessed messaging eventType=${eventType}`);
  }
}

