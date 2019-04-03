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
  team: PropTypes.object,
  sender: PropTypes.object
};

const defaultProps = {
  sender: {},
  team: null
};

const MessageResult = ({ message, sender, team, history }) => {
  const { content, created, conversationId } = message;
  const { firstName, lastName } = sender;
  const name = String.t('message.sentByName', { firstName, lastName });
  const { text = '' } = find(content, { type: 'text/plain' }) || {};
  const formattedText = Autolinker.link(text, { stripPrefix: false });
  const attachments = filter(content, ({ type }) => type !== 'text/plain');

  return (
    <div className="MessageResult" onClick={() => team && history.push(`/app/team/${team.teamId}`)}>
      <AvatarWrapper user={sender} />
      <div className="MessageResult__content">
        <p className="MessageResult__sender">
          {team && `#${team.name} - `}
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
