/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Divider, message as mssg } from 'antd';
import { find, includes, isEmpty } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import Autolinker from 'autolinker';

import String from 'src/translations';
import { AvatarWrapper, PreviewAttachments, VideoCallModal, ShareModal, MessageInput } from 'src/containers';
import MessageOptions from './MessageOptions';
import Metadata from './Metadata';
import './styles/style.css';

const URL_VALIDATION = /(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-;,./?%&=!]*)?/gm;

const propTypes = {
  message: PropTypes.object.isRequired,
  onMessageAction: PropTypes.func,
  sender: PropTypes.object,
  sharedProfile: PropTypes.object,
  conversationDisabled: PropTypes.bool,
  hide: PropTypes.bool,
  grouped: PropTypes.bool,
  currentPath: PropTypes.string,
  teamMembers: PropTypes.array,
  teamId: PropTypes.string,
  lastRead: PropTypes.bool,
  fetchMetadata: PropTypes.func,
  scrollToBottom: PropTypes.func,
  bookmarked: PropTypes.bool,
  ownMessage: PropTypes.bool,
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  makePersonalCall: PropTypes.func.isRequired,
  showDetailsOnAvatar: PropTypes.bool,
  showMetadata: PropTypes.bool,
  shareDataOwner: PropTypes.object,
  userRoles: PropTypes.object.isRequired,
  handleEditingAction: PropTypes.func.isRequired,
  userIsEditing: PropTypes.bool
};

const defaultProps = {
  sender: {},
  sharedProfile: null,
  bookmarked: false,
  ownMessage: false,
  hide: false,
  grouped: false,
  conversationDisabled: false,
  lastRead: false,
  teamMembers: [],
  currentPath: null,
  teamId: null,
  showDetailsOnAvatar: true,
  showMetadata: false,
  shareDataOwner: null,
  userIsEditing: false,
  fetchMetadata: () => {},
  scrollToBottom: () => {},
  onMessageAction: () => {}
};

export const messageAction = {
  replyTo: 'replyTo',
  bookmark: 'bookmark',
  delete: 'delete',
  edit: 'edit'
};

class ChatMessage extends Component {
  state = {
    isExpanded: includes(this.props.currentPath, this.props.message.messageId),
    videoCallModalVisible: false,
    shareModalVisible: false,
    sharePT: false,
    showEditInput: false
  };

  componentDidMount() {
    this.props.scrollToBottom();
  }

  componentWillReceiveProps({ currentPath, message }) {
    if (this.props.currentPath !== currentPath && includes(currentPath, message.messageId)) {
      this.setState({ isExpanded: true });
    }
  }

  handleShareProfile = sharePT => {
    this.setState({ shareModalVisible: true, sharePT });
  };

  showShareModal = () => {
    this.setState({
      shareModalVisible: !this.state.shareModalVisible
    });
  };

  onDeleteConfirmed = e => {
    const { message } = this.props;
    this.props.onMessageAction({ message }, messageAction.delete);
    e.stopPropagation();
  };

  showVideoCallModal = hide => {
    if (hide) {
      this.setState({ videoCallModalVisible: false });
    }
    this.setState({ videoCallModalVisible: !this.state.videoCallModalVisible });
  };

  handleEditMessage = option => {
    const { userIsEditing } = this.props;
    if (!userIsEditing) {
      this.setState({ showEditInput: option });
      this.props.handleEditingAction(option);
      document.body.addEventListener('click', this.editMessageClickOutsideHandler);
    } else if (option === false && userIsEditing) {
      this.setState({ showEditInput: option });
      this.props.handleEditingAction(option);
      document.body.removeEventListener('click', this.editMessageClickOutsideHandler);
    } else {
      mssg.success(String.t('message.userEditing'));
    }
  };

  editMessageClickOutsideHandler = e => {
    let messageInputIsOpen = false;
    if (e.path) {
      e.path.forEach(elem => {
        if (elem.classList && elem.classList.contains('Chat__message_edit_input')) {
          messageInputIsOpen = true;
        }
      });
    }

    if (!messageInputIsOpen) {
      this.setState({ showEditInput: false });
      this.props.handleEditingAction(false);
      document.body.removeEventListener('click', this.editMessageClickOutsideHandler);
    }
  };

  renderUserProfile = user => {
    const { currentUser } = this.props;
    return (
      <div className="User__Details-Data">
        <div className="User_MainInfo">
          <AvatarWrapper size="default" user={user} hideStatusTooltip showDetails={false} />
          <div className="User_Header">
            <span className="User_Name">{user.fullName}</span>
            <span className="User_Status">{user.preferences && user.preferences.customPresenceStatusMessage}</span>
          </div>
          <div className="User_action-buttons">
            <span onClick={() => this.props.history.push(`/app/chat/${user.userId}`)}>
              <i className="fas fa-comment" />
            </span>
            {user.userId !== currentUser.userId && user.presenceStatus !== 'busy' && (
              <span onClick={() => this.handleVideoCall(currentUser.userId, user.userId)}>
                <i className="fa fa-phone" />
              </span>
            )}
          </div>
        </div>
        <Divider style={{ margin: '10px auto 5px', background: '#7d7d7d' }} />
        <div className="User_ExtraInfo">
          <span className="User_DisplayName">{user.displayName}</span>
          <span className="User_TimeZone">
            {user.timeZone &&
              moment()
                .tz(user.timeZone)
                .format('HH:mm')}{' '}
            {String.t('sideBar.localTime')}
          </span>
          <span className="User_EMail">
            <a target="_blank" rel="noopener noreferrer" href={`mailto:${user.email}`}>
              {user.email}
            </a>
          </span>
        </div>
        {this.state.videoCallModalVisible && (
          <VideoCallModal visible={this.state.videoCallModalVisible} showModal={this.showVideoCallModal} user={user} />
        )}
      </div>
    );
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

  handleVideoCall = (callerId, calledId) => {
    this.setState({
      videoCallModalVisible: true
    });
    this.props.makePersonalCall(callerId, calledId);
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
    const { conversationDisabled, teamMembers, currentPath, teamId, onMessageAction } = this.props;
    let previousSenderId = null;
    if (!teamMembers || isEmpty(replies)) return null;

    return (
      <div className="message__replies">
        {replies.map(replyMessage => {
          // group messages from the same user
          const sender = teamMembers.find(member => member.userId === replyMessage.createdBy);
          if (!sender) return null;
          const grouped = previousSenderId === sender.userId;
          previousSenderId = sender.userId;

          return (
            <ChatMessage
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
            />
          );
        })}
      </div>
    );
  };

  renderBodyMessage = (message, child) => {
    const {
      sender,
      sharedProfile,
      ownMessage,
      scrollToBottom,
      grouped,
      bookmarked,
      conversationDisabled,
      shareDataOwner,
      showMetadata,
      userRoles
    } = this.props;

    const { messageId, content = [], created, conversationId, children } = message;
    const messageOwner = child && shareDataOwner ? shareDataOwner : sender;
    const { firstName, lastName, preferences, userId } = messageOwner;
    const replies = children && children.filter(msg => !msg.deleted);
    const { text = '' } = find(content, { type: 'text/plain' }) || {};
    const matchUrl = text && text.indexOf('@') < 0 ? text.match(URL_VALIDATION) : null;
    const attachments = content.filter(
      resource => resource.type !== 'text/plain' && resource.type !== 'userId' && resource.type !== 'sharedData'
    );
    const name = String.t('message.sentByName', { firstName, lastName });
    return (
      <div className={classNames(child ? 'Message__text_wrapper' : '')}>
        <Row type="flex" justify="start" gutter={10} style={{ alignItems: 'center' }}>
          <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon">
            {(!grouped || !isEmpty(replies) || child) && (
              <AvatarWrapper key={userId} user={sender} size="default" showDetails={this.props.showDetailsOnAvatar} />
            )}
          </Col>
          <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
            <div
              className={classNames('message__Bubble', {
                ownMessage,
                withArrow: !grouped || !isEmpty(replies) || child
              })}
            >
              <div>
                <div className="Message__text_content">
                  <p className="message__body-name">{name}</p>
                  {text && (
                    // eslint-disable-next-line react/no-danger
                    <p
                      dangerouslySetInnerHTML={{ __html: Autolinker.link(text, { stripPrefix: false }) }}
                      className="message__body-text"
                    />
                  )}
                  {content[0].sharedData && !sharedProfile && this.renderBodyMessage(content[0].sharedData, true)}
                  <div className={classNames(ownMessage ? 'message__inverted_order' : '')}>
                    <PreviewAttachments
                      attachments={attachments}
                      conversationId={conversationId}
                      onLoadImage={scrollToBottom}
                    />
                  </div>
                  {sharedProfile && this.renderUserProfile(sharedProfile)}
                  <span className="message__body-text-date"> ({moment(created).fromNow()})</span>
                </div>
                {showMetadata && matchUrl && this.renderMedatada(matchUrl)}
              </div>
            </div>
          </Col>
          {!conversationDisabled && !child && (
            <MessageOptions
              bookmarked={bookmarked}
              showOptions={ownMessage || (userRoles && userRoles.admin)}
              onReply={() => this.handleReplyTo({ messageId, firstName, lastName, preferences, text })}
              onBookmark={this.handleBookmark}
              onDeleteConfirmed={this.onDeleteConfirmed}
              handleShareProfile={this.handleShareProfile}
              handleEditMessage={this.handleEditMessage}
            />
          )}
        </Row>
      </div>
    );
  };

  render() {
    const { message, grouped, hide, lastRead } = this.props;
    const { showEditInput } = this.state;
    const { children, level } = message;
    const { content } = message;

    const replies = children && children.filter(msg => !msg.deleted);

    return (
      <div className={classNames({ 'message-nested': level !== 0, hide })}>
        {lastRead && this.renderLastReadMark()}
        <div
          className={classNames('message__main-container', {
            grouped: grouped && isEmpty(replies)
          })}
        >
          {!showEditInput ? (
            this.renderBodyMessage(message)
          ) : (
            <MessageInput
              messageToEdit={message}
              handleEditMessage={this.handleEditMessage}
              handleEditingAction={this.props.handleEditingAction}
            />
          )}

          {!isEmpty(replies) && (
            <div className="habla-label message__main-counter" onClick={this.handleShowReplies}>
              <span className="message__main-counter-number">{replies.length}</span>
              <i className="fas fa-reply" data-fa-transform="rotate-180" />
            </div>
          )}
        </div>
        {this.renderReplies(replies)}
        {this.state.shareModalVisible && (
          <ShareModal
            visible={this.state.shareModalVisible}
            showShareModal={this.showShareModal}
            dataforShare={content[0].sharedData ? content[0].sharedData : message}
            sharePT={this.state.sharePT}
          />
        )}
      </div>
    );
  }
}

ChatMessage.propTypes = propTypes;
ChatMessage.defaultProps = defaultProps;

export default ChatMessage;
