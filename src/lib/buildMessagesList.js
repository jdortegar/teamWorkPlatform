import { omit, unset } from 'lodash';
import moment from 'moment';

const buildMessage = message => ({ ...message, children: [] });

const replaceLocalMessage = (localId, array, newMessage) => {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const node = array[i];
    if (node.messageId === localId) {
      // eslint-disable-next-line no-param-reassign
      array[i] = buildMessage(newMessage);
      return node;
    } else if (node.children.length > 0) {
      return replaceLocalMessage(localId, node.children, buildMessage(newMessage));
    }
  }
  return null;
};

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
      if (moment(message.created).isAfter(moment(array[i].created))) {
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
    let existingMessage = result.byId[message.messageId];

    // if the localId is no longer valid, delete it, and update the message in the list
    if (message.localId && message.localId !== message.messageId) {
      result.byId[message.messageId] = omit(message, 'localId');
      unset(result.byId, message.localId);
      existingMessage = replaceLocalMessage(message.localId, result.messagesList, message);
    } else {
      result.byId[message.messageId] = message;
    }

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
