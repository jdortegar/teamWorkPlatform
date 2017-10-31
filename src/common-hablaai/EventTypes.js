const EventTypes = Object.freeze({
  presenceChanged: 'presenceChanged',
  userInvited: 'userInvited',
  userCreated: 'userCreated',
  userUpdated: 'userUpdated',
  userPrivateInfoUpdated: 'userPrivateInfoUpdated',

  subscriberOrgCreated: 'subscriberOrgCreated',
  subscriberOrgUpdated: 'subscriberOrgUpdated',
  subscriberOrgPrivateInfoUpdated: 'subscriberOrgPrivateInfoUpdated',
  subscriberAdded: 'subscriberAdded',

  teamCreated: 'teamCreated',
  teamUpdated: 'teamUpdated',
  teamPrivateInfoUpdated: 'teamPrivateInfoUpdated',
  teamMemberAdded: 'teamMemberAdded',

  teamRoomCreated: 'teamRoomCreated',
  teamRoomUpdated: 'teamRoomUpdated',
  teamRoomPrivateInfoUpdated: 'teamRoomPrivateInfoUpdated',
  teamRoomMemberAdded: 'teamRoomMemberAdded',

  conversationCreated: 'conversationCreated',
  conversationUpdated: 'conversationUpdated',
  messageCreated: 'messageCreated',

  typing: 'typing',
  location: 'location', // Sent from client only.  Location is included in presenceChanged notification event.

  integrationsUpdated: 'integrationsUpdated',
  boxWebhookEvent: 'boxWebhookEvent',
  googleWebhookEvent: 'googleWebhookEvent',

  from(value) { return (this[value]); }
});

export default EventTypes;

