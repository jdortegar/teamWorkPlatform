import { EventTypes } from '../messaging';
import { receiveSubscriberOrgs } from './subscriberOrgs';
import { receiveTeams } from './teams';
import { receiveTeamRooms } from './teamRooms';
import { receiveConversations, receiveTranscript } from './conversations';

let store;

export function setStore(reduxStore) {
  store = reduxStore;
}

export default function (eventType, event) {
  switch (eventType) {
    case EventTypes.presenceChanged:
      // TODO:
      break;
    case EventTypes.userUpdated:
      // TODO:
      break;
    case EventTypes.userPrivateInfoUpdated:
      // TODO;
      break;

    case EventTypes.subscriberOrgCreated:
      store.dispatch(receiveSubscriberOrgs([event]));
      break;
    case EventTypes.subscriberOrgUpdated:
      store.dispatch(receiveSubscriberOrgs([event]));
      break;
    case EventTypes.subscriberOrgPrivateInfoUpdated:
      // TODO:
      break;

    case EventTypes.teamCreated:
      store.dispatch(receiveTeams([event], event.subscriberOrgId));
      break;
    case EventTypes.teamUpdated:
      store.dispatch(receiveTeams([event], event.subscriberOrgId));
      break;
    case EventTypes.teamPrivateInfoUpdated:
      // TODO:
      break;
    case EventTypes.teamMemberAdded:
      // TODO:
      break;

    case EventTypes.teamRoomCreated:
      store.dispatch(receiveTeamRooms([event], event.teamId));
      break;
    case EventTypes.teamRoomUpdated:
      store.dispatch(receiveTeamRooms([event], event.teamId));
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
      store.dispatch(receiveTranscript([event], event.conversationId));
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
