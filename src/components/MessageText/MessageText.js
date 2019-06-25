import PropTypes from 'prop-types';
import _ from 'lodash';

const propTypes = {
  users: PropTypes.array,
  text: PropTypes.string
};

const defaultProps = {
  users: [],
  text: ''
};

const MENTION_VALIDATION = /\[id\].*?\[\/id\]/gm;

const MessageText = props => {
  const { text, users } = props;
  const taggedUsers = text.match(MENTION_VALIDATION);
  let textMessage = text;
  if (taggedUsers) {
    const textArray = _.isArray(text) ? text : text.split(':');
    textMessage = textArray.map(str => {
      if (str.match(MENTION_VALIDATION)) {
        const tagId = str.replace(/\[id\]|\[\/id\]/gm, '');
        const tagUser = users.find(userEl => userEl.userId === tagId);

        return `@${tagUser.fullName}`;
      }
      return str;
    });
  }

  return textMessage;
};

MessageText.propTypes = propTypes;
MessageText.defaultProps = defaultProps;

export default MessageText;
