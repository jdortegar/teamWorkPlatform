export default class Messages {
  _conversationId;

  // Key messageId, Value message.
  _messages = {};

  // Key messageId, Value array of messageIds.
  flattenedTree = {};

  constructor(conversationId, transcript, { defaultExpanded = true }) {
    this._conversationId = conversationId;
    this.defaultExpanded = defaultExpanded;
  }

  addMessages(messages) {
    messages.forEach((message) => {
      this._messages[message.messageId] = message;

      if (message.replyTo) {
        let parent = this.flattenedTree[message.replyTo];
        if (!parent) {
          parent = { expanded: this.defaultExpanded, children: [] };
          this.flattenedTree[message.replyTo] = parent;
        }
        parent.children.push(message.messageId);
      } else {
        const existing = this.flattenedTree[message.messageId];
        if (!existing) {
          this.flattenedTree[message.messageId] = { expanded: this.defaultExpanded, children: [] };
        }
      }
    });
  }

  get conversationId() {
    return this._conversationId;
  }
  get messages() {
    return this._messages;
  }
}
