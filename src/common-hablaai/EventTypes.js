const EventTypes = Object.freeze({
  presenceChanged: 'presenceChanged',
  userInvited: 'userInvited',
  userCreated: 'userCreated',
  userUpdated: 'userUpdated',
  userPrivateInfoUpdated: 'userPrivateInfoUpdated',
  userBookmarksUpdated: 'userBookmarksUpdated',
  userInvitationAccepted: 'userInvitationAccepted',
  userInvitationDeclined: 'userInvitationDeclined',
  sentInvitationStatus: 'sentInvitationStatus',

  subscriberOrgCreated: 'subscriberOrgCreated',
  subscriberOrgUpdated: 'subscriberOrgUpdated',
  subscriberOrgPrivateInfoUpdated: 'subscriberOrgPrivateInfoUpdated',
  subscriberAdded: 'subscriberAdded',

  teamCreated: 'teamCreated',
  teamUpdated: 'teamUpdated',
  teamPrivateInfoUpdated: 'teamPrivateInfoUpdated',
  teamMemberAdded: 'teamMemberAdded',

  conversationCreated: 'conversationCreated',
  conversationUpdated: 'conversationUpdated',
  messageCreated: 'messageCreated',
  messageRead: 'messageRead',
  messageUpdated: 'messageUpdated',
  messageDeleted: 'messageDeleted',
  messageLiked: 'messageLiked',
  messageDisliked: 'messageDisliked',
  messageFlagged: 'messageFlagged',

  typing: 'typing',
  location: 'location', // Sent from client only.  Location is included in presenceChanged notification event.

  integrationsUpdated: 'integrationsUpdated',
  boxWebhookEvent: 'boxWebhookEvent',
  googleWebhookEvent: 'googleWebhookEvent',

  // Video Call events
  makePersonalCall: 'makePersonalCall',
  makeTeamCall: 'makeTeamCall',
  answerCall: 'answerCall',
  answerTeamCall: 'answerTeamCall',

  from(value) {
    return this[value];
  }
});

export default EventTypes;
