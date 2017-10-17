import { EventTypes } from '../messaging';
import { receiveSubscriberOrg } from './subscriberOrgs';
import { receiveTeam } from './teams';
import { receiveTeamRoom } from './teamRooms';
import { receiveInvitation } from './invitations';
import { receiveConversations, receiveMessages, notifyMessage } from './conversations';

let store;

export function setStore(reduxStore) {
  store = reduxStore;
}

export default function (eventType, event) {
  switch (eventType) {
    case EventTypes.presenceChanged:
      // TODO:
      break;
    case EventTypes.userInvited:
      store.dispatch(receiveInvitation(event));
      break;
    case EventTypes.userUpdated:
      // TODO:
      break;
    case EventTypes.userPrivateInfoUpdated:
      // TODO:
      break;

    case EventTypes.subscriberOrgCreated:
      store.dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgUpdated:
      store.dispatch(receiveSubscriberOrg(event));
      break;
    case EventTypes.subscriberOrgPrivateInfoUpdated:
      // TODO:
      break;

    case EventTypes.teamCreated:
      store.dispatch(receiveTeam(event, event.subscriberOrgId));
      break;
    case EventTypes.teamUpdated:
      store.dispatch(receiveTeam(event, event.subscriberOrgId));
      break;
    case EventTypes.teamPrivateInfoUpdated:
      // TODO:
      break;
    case EventTypes.teamMemberAdded:
      // TODO:
      break;

    case EventTypes.teamRoomCreated:
      store.dispatch(receiveTeamRoom(event, event.teamId));
      break;
    case EventTypes.teamRoomUpdated:
      store.dispatch(receiveTeamRoom(event, event.teamId));
      break;
    case EventTypes.teamRoomPrivateInfoUpdated:
      // TODO:
      break;
    case EventTypes.teamRoomMemberAdded:
      // TODO:
      break;

    case EventTypes.conversationCreated:
      store.dispatch(receiveConversations([event], event.teamRoomId));
      break;
    case EventTypes.conversationUpdated:
      // TODO:
      break;
    case EventTypes.messageCreated:
      store.dispatch(receiveMessages([event], event.conversationId));
      store.dispatch(notifyMessage(event));
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
