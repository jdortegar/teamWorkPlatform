import React from 'react';
import PropTypes from 'prop-types';

import { MessageResult } from 'src/containers';
import './styles/ChatMessagesView.css';

const propTypes = {
  messages: PropTypes.array
};

const defaultProps = {
  messages: []
};

const ChatMessagesView = ({ messages }) => (
  <div className="ChatMessagesView">
    {messages.map(message => (
      <MessageResult key={message.id} message={message} />
    ))}
  </div>
);

ChatMessagesView.propTypes = propTypes;
ChatMessagesView.defaultProps = defaultProps;

export default ChatMessagesView;
