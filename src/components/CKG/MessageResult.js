import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Autolinker from 'autolinker';
import { find, filter } from 'lodash';

import String from 'src/translations';
import { AvatarWrapper } from 'src/containers';
import { PreviewAttachments } from 'src/components';
import './styles/MessageResult.css';

const propTypes = {
  message: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  team: PropTypes.object,
  sender: PropTypes.object,
  link: PropTypes.String
};

const defaultProps = {
  sender: {},
  team: null,
  link: null
};

const MessageResult = ({ message, sender, team, history, link }) => {
  const { content, created } = message;
  const { firstName, lastName } = sender;

  const name = String.t('message.sentByName', { firstName, lastName });
  const attachments = filter(content, ({ type }) => type !== 'text/plain');
  const { text = '' } = find(content, { type: 'text/plain' }) || {};
  const formattedText = Autolinker.link(text, { className: 'MessageResult__link', stripPrefix: false });

  return (
    <div className="MessageResult" onClick={() => history.push(link)}>
      <AvatarWrapper user={sender} />
      <div className="MessageResult__content">
        <p className="MessageResult__sender">
          {team && `#${team.name} - `}
          {name} - {moment(created).format('YYYY-MM-DD HH:mm')}
        </p>
        <p className="MessageResult__text">
          {<span dangerouslySetInnerHTML={{ __html: formattedText }} /> /* eslint-disable-line react/no-danger */}
        </p>
        <div onClick={e => e.stopPropagation()}>
          <PreviewAttachments attachments={attachments} />
        </div>
      </div>
    </div>
  );
};

MessageResult.propTypes = propTypes;
MessageResult.defaultProps = defaultProps;

export default MessageResult;
