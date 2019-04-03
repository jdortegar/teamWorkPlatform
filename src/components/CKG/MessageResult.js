import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Autolinker from 'autolinker';
import { find, filter } from 'lodash';

import String from 'src/translations';
import { AvatarWrapper, PreviewAttachments } from 'src/containers';
import './styles/MessageResult.css';

const propTypes = {
  message: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sender: PropTypes.object
};

const defaultProps = {
  sender: {}
};

const MessageResult = ({ message, sender, history }) => {
  const { content, created, teamId, conversationId } = message;
  const { firstName, lastName } = sender;
  const name = String.t('message.sentByName', { firstName, lastName });
  const { text = '' } = find(content, { type: 'text/plain' }) || {};
  const formattedText = Autolinker.link(text, { stripPrefix: false });
  const attachments = filter(content, ({ type }) => type !== 'text/plain');

  return (
    <div className="MessageResult" onClick={() => history.push(`/app/team/${teamId}`)}>
      <AvatarWrapper user={sender} />
      <div className="MessageResult__content">
        <p className="MessageResult__sender">
          {name} - {moment(created).fromNow()}
        </p>
        <p className="MessageResult__text">
          {<span dangerouslySetInnerHTML={{ __html: formattedText }} /> /* eslint-disable-line react/no-danger */}
        </p>
        <PreviewAttachments attachments={attachments} conversationId={conversationId} />
      </div>
    </div>
  );
};

MessageResult.propTypes = propTypes;
MessageResult.defaultProps = defaultProps;

export default MessageResult;
