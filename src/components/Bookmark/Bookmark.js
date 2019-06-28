import React from 'react';
import PropTypes from 'prop-types';

import { ChatMessage } from 'src/containers';

const propTypes = {
  message: PropTypes.object.isRequired,
  sender: PropTypes.object.isRequired,
  onMessageAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  teamId: PropTypes.string,
  memberId: PropTypes.string
};

const defaultProps = {
  teamId: null,
  memberId: null
};

const Bookmark = ({ message, sender, teamId, memberId, onMessageAction, history }) => {
  const handleClick = () => {
    if (teamId) {
      history.push({ pathname: `/app/team/${teamId}`, state: { messageId: message.id } });
    } else if (memberId) {
      history.push({ pathname: `/app/chat/${memberId}`, state: { messageId: message.id } });
    }
  };

  return (
    <div onClick={handleClick}>
      <ChatMessage message={message} sender={sender} onMessageAction={onMessageAction} />
    </div>
  );
};

Bookmark.propTypes = propTypes;
Bookmark.defaultProps = defaultProps;

export default Bookmark;
