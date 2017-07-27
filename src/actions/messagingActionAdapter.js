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
    case EventTypes.subscriberOrgCreated:
      store.dispatch(receiveSubscriberOrgs([event]));
      break;
    case EventTypes.teamCreated:
      store.dispatch(receiveTeams([event], event.subscriberOrgId));
      break;
    case EventTypes.teamRoomCreated:
      store.dispatch(receiveTeamRooms([event], event.teamId));
      break;
    case EventTypes.conversationCreated:
      store.dispatch(receiveConversations([event], event.teamRoomId));
      break;
    case EventTypes.messageCreated:
      store.dispatch(receiveTranscript([event], event.conversationId));
      break;
    default:
      console.log(`Unprocess messaging eventType=${eventType}`);
  }
}
