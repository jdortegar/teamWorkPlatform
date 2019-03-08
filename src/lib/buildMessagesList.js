const buildMessage = message => ({ ...message, children: [] });

const getNode = (messageId, array) => {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const node = array[i];
    if (node.messageId === messageId) {
      return node;
    } else if (node.children.length > 0) {
      const childNode = getNode(messageId, node.children);
      if (childNode !== null) {
        return childNode;
      }
    }
  }
  return null;
};

const addMessageToArray = (message, array) => {
  if (array.length === 0) {
    array.push(buildMessage(message));
  } else {
    let i = array.length - 1;
    for (; i >= 0; i -= 1) {
      if (message.created > array[i].created) {
        break;
      }
    }
    if (i < 0) {
      array.push(buildMessage(message));
    } else {
      array.splice(i + 1, 0, buildMessage(message));
    }
  }
};

const addMessageToList = (message, list) => {
  if (message.replyTo) {
    const parentNode = getNode(message.replyTo, list);
    if (parentNode === null) {
      return false;
    }
    addMessageToArray(message, parentNode.children);
  } else {
    addMessageToArray(message, list);
  }

  return true;
};

const addMessagesToList = (messages, list) => {
  const unaddedMessages = [];
  messages.forEach(message => {
    if (!addMessageToList(message, list)) {
      unaddedMessages.push(message);
    }
  });

  // Only try to add if something else was added.
  if (unaddedMessages.length > 0) {
    if (unaddedMessages.length < messages.length) {
      addMessagesToList(unaddedMessages, list);
    } else {
      unaddedMessages.forEach(message => {
        console.error(`Can't find parent ${message.replyTo} of messageId ${message.messageId}`); // eslint-disable-line no-console
      });
    }
  }
};

/*
 * This method adds and updates the messages, returning the updated result using this shape: { messagesList: [], byId: {} }
 *   messagesList: array of the top-level messages, order by created, each one containing its own children array (replies)
 *   byId: object with all the messages, messageId is the key
 */
const buildMessagesList = (messages = [], current = { messagesList: [], byId: {} }) => {
  const result = current;
  const unaddedMessages = [];

  messages.forEach(message => {
    const existingMessage = result.byId[message.messageId];
    result.byId[message.messageId] = message;

    if (!existingMessage) {
      if (!addMessageToList(message, result.messagesList)) {
        unaddedMessages.push(message);
      }
    }
  });

  if (unaddedMessages.length > 0) {
    addMessagesToList(unaddedMessages, result.messagesList);
  }

  return result;
};

export default buildMessagesList;
