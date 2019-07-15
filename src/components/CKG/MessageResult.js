import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Autolinker from 'autolinker';
import { find, filter, isArray } from 'lodash';
import classNames from 'classnames';

import String from 'src/translations';
import { AvatarWrapper } from 'src/containers';
import { PreviewAttachments, Spinner } from 'src/components';
import './styles/MessageResult.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  link: PropTypes.string,
  members: PropTypes.array,
  message: PropTypes.object,
  sender: PropTypes.object,
  style: PropTypes.object,
  team: PropTypes.object,
  users: PropTypes.array.isRequired,
  fetchMessage: PropTypes.func.isRequired,
  messageData: PropTypes.object
};

const defaultProps = {
  message: null,
  link: null,
  members: [],
  sender: {},
  style: {},
  team: null,
  messageData: {}
};

const MENTION_VALIDATION = /\[id\].*?\[\/id\]/gm;

class MessageResult extends React.Component {
  componentDidMount() {
    const { messageData, message } = this.props;
    if (messageData && !message) {
      this.props.fetchMessage(messageData.conversationId, messageData.messageId);
    }
  }

  render() {
    if (!this.props.message) return <Spinner />;
    const { message, sender, team, history, link, style, users, members } = this.props;
    const { content, created, id } = message;
    const { firstName, lastName } = sender;

    const name = String.t('message.sentByName', { firstName, lastName });
    const attachments = filter(content, ({ type }) => type !== 'text/plain');
    let { text = '' } = find(content, { type: 'text/plain' }) || {};

    const taggedUsers = text.match(MENTION_VALIDATION);
    if (taggedUsers) {
      const textArray = isArray(text) ? text : text.split(':');
      text = textArray.map(str => {
        if (str.match(MENTION_VALIDATION)) {
          const tagId = str.replace(/\[id\]|\[\/id\]/gm, '');
          const tagUser = users.find(userEl => userEl.userId === tagId);
          return <AvatarWrapper key={tagId} user={tagUser} wrapMention />;
        }
        return (
          <span
            key={Math.random()}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: Autolinker.link(str, { className: 'MessageResult__link', stripPrefix: false })
            }}
          />
        );
      });
    }

    // Message Title
    const member1 = users.find(userEl => userEl.userId === members[0])
      ? users.find(userEl => userEl.userId === members[0]).fullName
      : 'Unknow User';
    const member2 = users.find(userEl => userEl.userId === members[1])
      ? users.find(userEl => userEl.userId === members[1]).fullName
      : 'Unknow User';
    let title = String.t('message.messageTitle', { member1, member2 });
    if (team) {
      title = String.t('message.messageTitleTeam', { team: team.name });
    }

    return (
      <div
        className={classNames('MessageResult', { MessageResult__NoBackground: !style.background })}
        onClick={() => history.push({ pathname: link, state: { messageId: id } })}
      >
        <span className="Message__title">{title}</span>
        <div className="Message__container">
          <AvatarWrapper user={sender} size={style.avatarSize || 'default'} />
          <div className="MessageResult__content">
            <p className="MessageResult__sender">
              {team && `#${team.name} - `}
              {name} - {moment(created).format('YYYY-MM-DD HH:mm')}
            </p>
            {text && isArray(text) ? (
              <span className="MessageResult__text">{text}</span>
            ) : (
              <p
                className="MessageResult__text"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: Autolinker.link(text, { stripPrefix: false }) }}
              />
            )}
            {style.imagePreview && (
              <div onClick={e => e.stopPropagation()}>
                <PreviewAttachments attachments={attachments} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

MessageResult.propTypes = propTypes;
MessageResult.defaultProps = defaultProps;

export default MessageResult;
