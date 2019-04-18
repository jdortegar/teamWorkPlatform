import { findIndex } from 'lodash';
import moment from 'moment';

// Add the children property to the message
const withChildren = message => ({ ...message, children: [] });

// Find a message by id in the given array, also searching into its children recursively
const findMessage = (id, array = []) => {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const node = array[i];
    if (node.id === id) return node;
    const childNode = findMessage(id, node.children);
    if (childNode) return childNode;
  }
  return null;
};

// Place the message into the given array based on the "created" property, latest in the end
const placeIntoArray = (message, array = []) => {
  const index = findIndex(array, item => moment(item.created).isAfter(moment(message.created)));
  if (index < 0) {
    array.push(message);
  } else {
    array.splice(index, 0, message);
  }
};

// Find the parent message if it's already in the list and add the reply as its children. Return true if successful
const addReply = (message, array) => {
  const parent = findMessage(message.replyTo, array);
  if (!parent) return false;
  placeIntoArray(message, parent.children);
  return true;
};

/*
 * This method creates the messages list.
 *   It takes the ids of the messages to be included, and the byId object containing all messages (with id as the key)
 *   Returns an array of the top-level messages, order by creation date, each one containing its own children array (replies)
 */
const buildMessagesList = (ids, byId) => {
  const result = [];
  let remaining = ids;

  // First, add the "root" messages to the array (messages that are not replies) and keep track of the remaining messages
  const rootMessages = ids.map(m => byId[m]).filter(msg => msg && !msg.replyTo);
  rootMessages.forEach(message => {
    placeIntoArray(withChildren(message), result);
    remaining = remaining.filter(id => id !== message.id);
  });

  // Try to add replies to the list as message children, returning the ids that couldn't be placed
  const addReplies = repliesIds =>
    repliesIds.filter(messageId => (addReply(withChildren(byId[messageId]), result) ? null : messageId));

  /* Since we have multi-level replies, some of them can be children of a message that is not on the list yet
   * So we keep track of the ids that couldn't be added (remaining) and we try again
   * If no items were added and we have ids remaining, that means the parent message doesn't exist anymore (deleted). */
  let count = 0;
  do {
    count = remaining.length;
    remaining = addReplies(remaining);
  } while (remaining.length > 0 && remaining.length !== count);

  return result;
};

export default buildMessagesList;
