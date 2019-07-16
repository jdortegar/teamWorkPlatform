import React from 'react';
import PropTypes from 'prop-types';

import { MessageResult } from 'src/containers';
import './styles/ChatMessagesView.css';

const propTypes = {
  messages: PropTypes.array,
  loading: PropTypes.bool
};

const defaultProps = {
  messages: [],
  loading: false
};

const ChatMessagesView = ({ messages, loading }) => (
  <div className="ChatMessagesView">
    {!loading &&
      messages.map(message => (
        <MessageResult key={message.id} message={message} style={{ background: true, imagePreview: true }} />
      ))}
  </div>
);

ChatMessagesView.propTypes = propTypes;
ChatMessagesView.defaultProps = defaultProps;

export default ChatMessagesView;
