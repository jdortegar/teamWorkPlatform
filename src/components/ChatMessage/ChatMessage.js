/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Divider, message as mssg, Tooltip } from 'antd';
import { find, includes, isEmpty, forEach, isArray } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import Autolinker from 'autolinker';
import { Picker } from 'emoji-mart';

import Str from 'src/translations';
import {
  AvatarWrapper,
  VideoCallModal,
  ShareModal,
  MessageInput,
  ChatMessage as ChatMessageContainer
} from 'src/containers';
import { PreviewAttachments, PreviewMessageModal } from 'src/components';
import MessageOptions from './MessageOptions';
import Metadata from './Metadata';
import './styles/style.css';

const URL_VALIDATION = /(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-;,./?%&=!]*)?/gm;
const MENTION_VALIDATION = /\[id\].*?\[\/id\]/gm;

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
  unread: PropTypes.bool,
  fetchMetadata: PropTypes.func,
  onLoadMessage: PropTypes.func,
  bookmarked: PropTypes.bool,
  ownMessage: PropTypes.bool,
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  makePersonalCall: PropTypes.func.isRequired,
  showDetailsOnAvatar: PropTypes.bool,
  showMetadata: PropTypes.bool,
  shareDataOwner: PropTypes.object,
  userRoles: PropTypes.object.isRequired,
  handleStateOnParent: PropTypes.func,
  userIsEditing: PropTypes.bool,
  createMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  saveBookmark: PropTypes.func.isRequired,
  removeBookmark: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

const defaultProps = {
  sender: {},
  sharedProfile: null,
  bookmarked: false,
  ownMessage: false,
  hide: false,
  grouped: false,
  conversationDisabled: false,
  unread: false,
  teamMembers: [],
  currentPath: null,
  showDetailsOnAvatar: true,
  showMetadata: false,
  shareDataOwner: null,
  userIsEditing: false,
  fetchMetadata: () => {},
  onLoadMessage: () => {},
  onMessageAction: () => {},
  handleStateOnParent: () => {}
};

export const messageAction = {
  replyTo: 'replyTo',
  bookmark: 'bookmark',
  delete: 'delete',
  edit: 'edit'
};

class ChatMessage extends Component {
  state = {
    isExpanded: includes(this.props.currentPath, this.props.message.id),
    videoCallModalVisible: false,
    previewMessageModalVisible: false,
    shareModalVisible: false,
    sharePT: false,
    showEditInput: false,
    showReplyInput: false,
    showEmojiPicker: false,
    reactions: {},
    replyTo: null
  };

  componentWillMount() {
    const { message } = this.props;
    this.buildReactions(message.children);
  }

  componentWillReceiveProps({ currentPath, message }) {
    if (this.props.currentPath !== currentPath && includes(currentPath, message.id)) {
      this.setState({ isExpanded: true });
    }
    this.buildReactions(message.children);
  }

  buildReactions = childrenMessages => {
    if (!isEmpty(childrenMessages)) {
      const reactions = {};
      const reactionsMessages = childrenMessages.filter(
        msg => msg.content[0] && msg.content[0].type === 'emojiReaction'
      );

      forEach(reactionsMessages, msg => {
        if (!msg.deleted) {
          const emoji = msg.content[0].text;
          reactions[emoji] = reactions[emoji]
            ? [...reactions[emoji], { id: msg.id, userId: msg.createdBy, colons: msg.content[0].colons }]
            : [{ id: msg.id, userId: msg.createdBy, colons: msg.content[0].colons }];
        }
      });

      this.setState({ reactions });
    }
  };

  handleShareProfile = sharePT => {
    this.setState({ shareModalVisible: true, sharePT });
  };

  showShareModal = () => {
    this.setState({
      shareModalVisible: !this.state.shareModalVisible
    });
  };

  showPreviewMessageModal = hide => {
    if (!hide) return this.setState({ previewMessageModalVisible: false });
    return this.setState({ previewMessageModalVisible: !this.state.previewMessageModalVisible });
  };

  showVideoCallModal = hide => {
    if (hide) return this.setState({ videoCallModalVisible: false });
    return this.setState({ videoCallModalVisible: !this.state.videoCallModalVisible });
  };

  toggleBookmark = bookmarked => {
    const { message, saveBookmark, removeBookmark } = this.props;
    if (bookmarked) {
      removeBookmark(message.id).then(() => mssg.success(Str.t('message.bookmarkRemovedToast')));
    } else {
      saveBookmark(message.id).then(() => mssg.success(Str.t('message.bookmarkSetToast')));
    }
  };

  handleEditMessage = option => {
    const { userIsEditing } = this.props;
    if (!userIsEditing) {
      this.setState({ showEditInput: option });
      this.props.handleStateOnParent({ userIsEditing: option });
      document.body.addEventListener('click', this.editMessageClickOutsideHandler);
    } else if (option === false && userIsEditing) {
      this.setState({ showEditInput: option });
      this.props.handleStateOnParent({ userIsEditing: option });
      document.body.removeEventListener('click', this.editMessageClickOutsideHandler);
    } else {
      mssg.success(Str.t('message.userEditing'));
    }
  };

  handleReplyMessage = option => {
    const { userIsEditing, message } = this.props;
    if (!userIsEditing) {
      this.setState({ showReplyInput: option, replyTo: { ...message } });
      this.props.handleStateOnParent({ userIsEditing: option });
      document.body.addEventListener('click', this.editMessageClickOutsideHandler);
    } else if (option === false && userIsEditing) {
      this.setState({ showReplyInput: option, replyTo: null });
      this.props.handleStateOnParent({ userIsEditing: option });
      document.body.removeEventListener('click', this.editMessageClickOutsideHandler);
    } else {
      mssg.success(Str.t('message.userEditing'));
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
      this.setState({ showEditInput: false, showReplyInput: false });
      this.props.handleStateOnParent({ userIsEditing: false });
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
            {Str.t('sideBar.localTime')}
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

  handleVideoCall = (callerId, calledId) => {
    this.setState({
      videoCallModalVisible: true
    });
    this.props.makePersonalCall(callerId, calledId);
  };

  renderMedatada = matchUrl =>
    matchUrl.map(url => (
      <Metadata key={url} url={url} fetchMetadata={this.props.fetchMetadata} onLoadImage={this.props.onLoadMessage} />
    ));

  renderUnreadMark = () => (
    <div className="message__unread_mark border-top-red">
      <span className="message__last-read">{Str.t('message.unreadMessageSeparator')}</span>
    </div>
  );

  toogleEmojiState = () => {
    if (this.state.showEmojiPicker) {
      document.body.removeEventListener('click', this.emojiMartClickOutsideHandler);
      this.setState({ showEmojiPicker: false });
      this.props.handleStateOnParent({ userIsEditing: false });
    } else {
      document.body.addEventListener('click', this.emojiMartClickOutsideHandler);
      this.setState({ showEmojiPicker: true });
      this.props.handleStateOnParent({ userIsEditing: true });
    }
  };

  emojiMartClickOutsideHandler = e => {
    let emojiWindowIsOpen = false;
    if (e.path) {
      e.path.forEach(elem => {
        if (elem.classList && elem.classList.contains('emoji-mart')) {
          emojiWindowIsOpen = true;
        }
      });
    }

    if (!emojiWindowIsOpen) {
      this.setState({ showEmojiPicker: false });
      this.props.handleStateOnParent({ userIsEditing: false });
      document.body.removeEventListener('click', this.emojiMartClickOutsideHandler);
    }
  };

  addEmoji = e => {
    const { message, currentUser } = this.props;
    const { reactions = {} } = this.state;
    const { conversationId, children } = message;

    // codify emoji
    let emojiPic;
    if (!e.unified) {
      emojiPic = e;
    } else if (e.unified.length <= 5) {
      emojiPic = String.fromCodePoint(`0x${e.unified}`);
    } else {
      const sym = e.unified.split('-');
      const codesArray = [];
      sym.forEach(el => codesArray.push(`0x${el}`));
      emojiPic = String.fromCodePoint(...codesArray);
    }
    const replyTo = { ...message };
    const existingEmoji = reactions[emojiPic] && reactions[emojiPic].find(msg => msg.userId === currentUser.userId);
    if (existingEmoji) {
      const reactionMessage = children.find(msg => msg.id === existingEmoji.id);
      this.props.deleteMessage(reactionMessage).catch(error => mssg.error(error.message));
    } else {
      this.props
        .createMessage({
          text: emojiPic,
          emojiReaction: e.colons ? e.colons : e,
          conversationId,
          replyTo
        })
        .catch(error => {
          mssg.error(error.message);
        });
    }
  };

  renderReplies = replies => {
    const { teamMembers, ...parentProps } = this.props;
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
            <ChatMessageContainer
              {...parentProps}
              key={replyMessage.id}
              message={replyMessage}
              conversationId={replyMessage.conversationId}
              sender={sender}
              grouped={grouped}
              hide={!this.state.isExpanded}
              teamMembers={teamMembers}
            />
          );
        })}
      </div>
    );
  };

  renderMembersReacted = reactions => {
    const { users } = this.props;
    return `${reactions.map(reaction => users[reaction.userId].fullName).join(', ')} ${Str.t('message.reactedWith')} ${
      reactions[0].colons
    }`;
  };

  renderReactions = reactions =>
    Object.keys(reactions).map(reaction => (
      <Tooltip placement="top" title={this.renderMembersReacted(reactions[reaction])} key={`emoji-${reaction}`}>
        <div className="emoji-reaction" onClick={() => this.addEmoji(reaction)} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="emoji" style={{ color: 'black' }}>
            {reaction}
          </span>
          {reactions[reaction].length}
        </div>
      </Tooltip>
    ));

  renderBodyMessage = (message, child) => {
    const {
      sender,
      sharedProfile,
      ownMessage,
      grouped,
      bookmarked,
      conversationDisabled,
      shareDataOwner,
      showMetadata,
      userRoles,
      users
    } = this.props;
    if (!message) return false;
    const { content = [], created, children, appData = null } = message;
    const { reactions } = this.state;

    const messageOwner = child && shareDataOwner ? shareDataOwner : sender;
    const { firstName, lastName, userId } = messageOwner;
    const replies = children && children.filter(msg => !msg.deleted && msg.content[0].type !== 'emojiReaction');
    let { text = '' } = find(content, { type: 'text/plain' }) || {};

    const MessageTextClass = classNames('message__body-text', { onlyemoji: !text.match(/(\w+)/g) });
    let matchUrl = text && text.indexOf('@') < 0 ? text.match(URL_VALIDATION) : null;
    const attachments = content.filter(
      resource => resource.type !== 'text/plain' && resource.type !== 'userId' && resource.type !== 'sharedData'
    );
    const name = Str.t('message.sentByName', { firstName, lastName });
    // If exist tagged user, replace
    const taggedUsers = text.match(MENTION_VALIDATION);
    if (taggedUsers) {
      const textArray = isArray(text) ? text : text.split(':');
      text = textArray.map(str => {
        if (str.match(MENTION_VALIDATION)) {
          const tagId = str.replace(/\[id\]|\[\/id\]/gm, '');
          const tagUser = Object.values(users).find(userEl => userEl.userId === tagId);
          return <AvatarWrapper key={tagId} user={tagUser} wrapMention />;
        }
        matchUrl = str.match(URL_VALIDATION);
        return (
          <span
            key={Math.random()}
            dangerouslySetInnerHTML={{ __html: Autolinker.link(str, { stripPrefix: false }) }}
          />
        );
      });
    }

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
                  {text && isArray(text) ? (
                    <span className={MessageTextClass}>{text}</span>
                  ) : (
                    // eslint-disable-next-line react/no-danger
                    <p
                      dangerouslySetInnerHTML={{ __html: Autolinker.link(text, { stripPrefix: false }) }}
                      className={MessageTextClass}
                    />
                  )}
                  {content[0].type === 'sharedData' && appData && this.renderBodyMessage(appData.dataforShare, true)}
                  <div className={classNames(ownMessage ? 'message__inverted_order' : '')}>
                    <PreviewAttachments attachments={attachments} onLoadImage={() => {}} />
                  </div>
                  {sharedProfile && this.renderUserProfile(sharedProfile)}
                  <span className="message__body-text-date"> ({moment(created).fromNow()})</span>
                </div>
                {showMetadata && matchUrl && this.renderMedatada(matchUrl)}
              </div>
            </div>
            {this.state.showEmojiPicker && !child && (
              <div className="emoji-reaction-picker">
                <Picker onClick={this.addEmoji} />
              </div>
            )}
          </Col>
          {!conversationDisabled && !child && (
            <MessageOptions
              attachments={attachments}
              bookmarked={bookmarked}
              showOptions={ownMessage || (userRoles && userRoles.admin)}
              onReply={this.handleReplyMessage}
              onBookmark={this.toggleBookmark}
              onDelete={this.showPreviewMessageModal}
              handleShareProfile={this.handleShareProfile}
              handleEditMessage={this.handleEditMessage}
              onAddReaction={this.toogleEmojiState}
              showReply={!message.appData.globalScheduleId}
            />
          )}
        </Row>
        {reactions && (
          <Row type="flex" justify="start" gutter={10} style={{ alignItems: 'center' }}>
            <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon" />
            <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
              {Object.keys(reactions).length > 0 && (
                <div className="emoji-reaction-container">{this.renderReactions(reactions)}</div>
              )}
            </Col>
          </Row>
        )}
      </div>
    );
  };

  render() {
    const { message, grouped, hide, unread } = this.props;
    const { showEditInput, showReplyInput } = this.state;
    const { children, conversationId, replyTo, appData = null } = message;
    const { content } = message;
    if (isEmpty(content)) return null;

    const replies = children && children.filter(msg => !msg.deleted && msg.content[0].type !== 'emojiReaction');
    return (
      <div className={classNames({ 'message-nested': replyTo, hide })}>
        {unread && this.renderUnreadMark()}
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
              conversationId={conversationId}
              handleEditMessage={this.handleEditMessage}
              handleEditingAction={this.props.handleStateOnParent}
            />
          )}

          {showReplyInput && (
            <div className="message__reply_container message-nested">
              <div className="message__reply-icon">
                <i className="fas fa-reply" />
              </div>
              <div className="message-reply-container">
                <MessageInput
                  replyTo={this.state.replyTo}
                  conversationId={conversationId}
                  handleReplyMessage={this.handleReplyMessage}
                  handleEditingAction={this.props.handleStateOnParent}
                />
              </div>
            </div>
          )}

          {!isEmpty(replies) && (
            <div className="habla-label message__main-counter" onClick={() => this.handleShowReplies()}>
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
            dataforShare={content[0].type === 'sharedData' ? appData.dataforShare : message}
            sharePT={this.state.sharePT}
          />
        )}
        {this.state.previewMessageModalVisible && (
          <PreviewMessageModal
            message={message}
            title={Str.t('message.deleteTitle')}
            okButton={Str.t('deleteButton')}
            okButtonClass="Delete_button"
            subtitle={Str.t('message.deleteSubtitle')}
            visible={this.state.previewMessageModalVisible}
            showPreviewMessageModal={this.showPreviewMessageModal}
            onConfirmed={() => {
              this.props.onMessageAction({ message }, messageAction.delete);
              this.showPreviewMessageModal(false);
            }}
          />
        )}
      </div>
    );
  }
}

ChatMessage.propTypes = propTypes;
ChatMessage.defaultProps = defaultProps;

export default ChatMessage;
