import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { find, includes, isEmpty } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import Autolinker from 'autolinker';

import String from 'src/translations';
import { AvatarWrapper, PreviewImages } from 'src/containers';
import MessageOptions from './MessageOptions';
import Metadata from './Metadata';
import './styles/style.css';

const propTypes = {
  message: PropTypes.object.isRequired,
  onMessageAction: PropTypes.func.isRequired,
  sender: PropTypes.object,
  conversationId: PropTypes.string,
  conversationDisabled: PropTypes.bool,
  isAdmin: PropTypes.bool.isRequired,
  hide: PropTypes.bool,
  grouped: PropTypes.bool,
  currentPath: PropTypes.string,
  teamMembers: PropTypes.array,
  personalConversation: PropTypes.object,
  teamId: PropTypes.string,
  lastRead: PropTypes.bool,
  fetchMetadata: PropTypes.func,
  scrollToBottom: PropTypes.func,
  bookmarked: PropTypes.bool,
  ownMessage: PropTypes.bool
};

const defaultProps = {
  sender: {},
  personalConversation: {},
  conversationId: null,
  bookmarked: false,
  ownMessage: false,
  hide: false,
  grouped: false,
  conversationDisabled: false,
  lastRead: false,
  teamMembers: [],
  currentPath: null,
  teamId: null,
  fetchMetadata: () => {},
  scrollToBottom: () => {}
};

export const messageAction = {
  replyTo: 'replyTo',
  thumb: 'thumb',
  bookmark: 'bookmark',
  flag: 'flag',
  delete: 'delete',
  edit: 'edit'
};

class Message extends Component {
  state = {
    mute: true,
    isExpanded: includes(this.props.currentPath, this.props.message.messageId)
  };

  componentDidMount() {
    this.props.scrollToBottom();
  }

  componentWillReceiveProps({ currentPath, message }) {
    if (this.props.currentPath !== currentPath && includes(currentPath, message.messageId)) {
      this.setState({ isExpanded: true });
    }
  }

  onDeleteConfirmed = e => {
    const { message } = this.props;
    this.props.onMessageAction({ message }, messageAction.delete);
    e.stopPropagation();
  };

  handleShowReplies = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleReplyTo = extraInfo => {
    const { message } = this.props;
    this.props.onMessageAction({ message, extraInfo }, messageAction.replyTo);
  };

  handleBookmark = setBookmark => {
    const { message, teamId } = this.props;
    const extraInfo = { setBookmark };
    const bookmark = { ...message, teamId };
    this.props.onMessageAction({ bookmark, extraInfo }, messageAction.bookmark);
  };

  handleThumb = direction => {
    const { message } = this.props;
    const extraInfo = { direction };
    this.props.onMessageAction({ message, extraInfo }, messageAction.thumb);
  };

  handleFlag = () => {
    const { message } = this.props;
    this.props.onMessageAction({ message }, messageAction.flag);
  };

  changeVolume = () => {
    this.setState({ mute: !this.state.mute });
  };

  renderMedatada = matchUrl =>
    matchUrl.map(url => (
      <Metadata key={url} url={url} fetchMetadata={this.props.fetchMetadata} onLoadImage={this.props.scrollToBottom} />
    ));

  renderLastReadMark = () => (
    <div className="message__unread_mark border-top-red">
      <span className="message__last-read">{String.t('message.unreadMessageSeparator')}</span>
    </div>
  );

  renderReplies = replies => {
    const { conversationDisabled, teamMembers, currentPath, teamId, isAdmin, onMessageAction } = this.props;
    let previousSenderId = null;
    if (isEmpty(replies)) return null;

    return (
      <div className="message__replies">
        {replies.map(replyMessage => {
          // group messages from the same user
          const sender = teamMembers.find(member => member.userId === replyMessage.createdBy);
          if (!sender) return null;
          const grouped = previousSenderId === sender.userId;
          previousSenderId = sender.userId;

          return (
            <Message
              conversationDisabled={conversationDisabled}
              message={replyMessage}
              sender={sender}
              grouped={grouped}
              key={replyMessage.messageId}
              onMessageAction={onMessageAction}
              hide={!this.state.isExpanded}
              currentPath={currentPath}
              teamMembers={teamMembers}
              teamId={teamId}
              isAdmin={isAdmin}
            />
          );
        })}
      </div>
    );
  };

  render() {
    const {
      message,
      sender,
      conversationId,
      personalConversation,
      teamMembers,
      grouped,
      hide,
      isAdmin,
      lastRead,
      bookmarked,
      ownMessage,
      conversationDisabled,
      scrollToBottom
    } = this.props;
    const { messageId, children, level, content, created } = message;
    const { firstName, lastName, preferences, userId } = sender;

    const { text = '' } = find(content, { type: 'text/plain' }) || {};
    const matchUrl = text ? text.match(/(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-;,./?%&=!]*)?/gm) : null;
    const otherContent = content.filter(resource => resource.type !== 'text/plain');
    const name = String.t('message.sentByName', { firstName, lastName });
    const replies = children.filter(msg => !msg.deleted);

    const messageBody = (
      <div>
        <p className={classNames('message__body-name', ownMessage ? 'message__inverted_order' : '')}>{name}</p>
        <p className="message__body-text">
          {text && (
            // eslint-disable-next-line react/no-danger
            <span dangerouslySetInnerHTML={{ __html: Autolinker.link(text, { stripPrefix: false }) }} />
          )}
          <span className="message__body-text-date"> ({moment(created).fromNow()})</span>
        </p>
      </div>
    );

    return (
      <div className={classNames({ 'message-nested': level !== 0, hide })}>
        {lastRead && this.renderLastReadMark()}
        <div className={classNames('message__main-container', { grouped: grouped && isEmpty(replies) })}>
          <Row
            type="flex"
            justify="start"
            gutter={10}
            className={classNames(ownMessage ? 'message__inverted_order' : '')}
          >
            <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon">
              {(!grouped || !isEmpty(replies)) && <AvatarWrapper key={userId} user={sender} size="default" />}
            </Col>
            <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
              <div
                className={classNames('message__Bubble', ownMessage ? 'right' : 'left', {
                  withArrow: !grouped || !isEmpty(replies)
                })}
              >
                {messageBody}
                {matchUrl && this.renderMedatada(matchUrl)}
                {otherContent.length > 0 && (
                  <div className={classNames(ownMessage ? 'message__inverted_order' : '')}>
                    <PreviewImages
                      images={otherContent}
                      conversationId={conversationId}
                      onLoadImage={scrollToBottom}
                      personalConversation={personalConversation}
                    />
                  </div>
                )}
                {!conversationDisabled && (
                  <MessageOptions
                    bookmarked={bookmarked}
                    showDelete={isAdmin || ownMessage}
                    onReply={() => this.handleReplyTo({ messageId, firstName, lastName, preferences, text })}
                    onBookmark={this.handleBookmark}
                    onDeleteConfirmed={this.onDeleteConfirmed}
                  />
                )}
              </div>
            </Col>
          </Row>
          {!isEmpty(replies) && (
            <div className="habla-label message__main-counter" onClick={this.handleShowReplies}>
              <span className="message__main-counter-number">{replies.length}</span>
              <i className="fas fa-reply" data-fa-transform="rotate-180" />
            </div>
          )}
        </div>
        {teamMembers && this.renderReplies(replies)}
      </div>
    );
  }
}

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
