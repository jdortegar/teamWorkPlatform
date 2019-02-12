import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Row, Col, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';

import String from 'src/translations';
import { AvatarWrapper } from 'src/components';
import { PreviewImages } from 'src/containers';
import Metadata from './Metadata';
import './styles/style.css';

const propTypes = {
  hide: PropTypes.bool,
  currentPath: PropTypes.string,
  conversationDisabled: PropTypes.bool,
  onMessageAction: PropTypes.func.isRequired,
  teamMembers: PropTypes.array,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  teamId: PropTypes.string,
  isAdmin: PropTypes.bool.isRequired,
  onLoadImages: PropTypes.func,
  lastRead: PropTypes.bool,
  personalConversation: PropTypes.object,
  fetchMetadata: PropTypes.func
};

const defaultProps = {
  hide: false,
  conversationDisabled: false,
  teamMembers: null,
  onLoadImages: null,
  lastRead: false,
  currentPath: null,
  teamId: null,
  personalConversation: {},
  fetchMetadata: null
};

export const messageAction = {
  replyTo: 'replyTo',
  thumb: 'thumb', // "up" or "down"
  bookmark: 'bookmark',
  flag: 'flag',
  delete: 'delete',
  edit: 'edit'
};

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mute: true,
      isExpanded: _.includes(props.currentPath, props.message.messageId)
    };

    this.handleReplyTo = this.handleReplyTo.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.handleThumb = this.handleThumb.bind(this);
    this.handleFlag = this.handleFlag.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.onDeleteConfirmed = this.onDeleteConfirmed.bind(this);
    this.handleShowReplies = this.handleShowReplies.bind(this);
  }

  componentWillReceiveProps({ currentPath, message }) {
    if (this.props.currentPath !== currentPath && _.includes(currentPath, message.messageId)) {
      this.setState({ isExpanded: true });
    }
  }

  onDeleteConfirmed(e) {
    const { message } = this.props;
    this.props.onMessageAction({ message }, messageAction.delete);
    e.stopPropagation();
  }

  handleShowReplies() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  handleReplyTo(extraInfo) {
    const { message } = this.props;
    this.props.onMessageAction({ message, extraInfo }, messageAction.replyTo);
  }

  handleBookmark(setBookmark) {
    const { message, teamId } = this.props;
    const extraInfo = { setBookmark };
    const bookmark = { ...message, teamId };
    this.props.onMessageAction({ bookmark, extraInfo }, messageAction.bookmark);
  }

  handleThumb(direction) {
    const { message } = this.props;
    const extraInfo = { direction };
    this.props.onMessageAction({ message, extraInfo }, messageAction.thumb);
  }

  handleFlag() {
    const { message } = this.props;
    this.props.onMessageAction({ message }, messageAction.flag);
  }

  changeVolume() {
    this.setState({
      mute: !this.state.mute
    });
  }

  renderMedatada(matchUrl) {
    return matchUrl.map(url => <Metadata key={url} url={url} fetchMetadata={this.props.fetchMetadata} />);
  }

  render() {
    const { message, user, currentUser, teamMembers, hide, lastRead, conversationDisabled, isAdmin } = this.props;
    const { messageId, children, level, content, createdBy } = message;
    const orgBookmarks = currentUser.bookmarks[this.props.subscriberOrgId];
    const hasBookmark = orgBookmarks && orgBookmarks.messageIds && orgBookmarks.messageIds[message.messageId];
    const { firstName, lastName, preferences, userId } = user;
    const date = moment(message.created).fromNow();
    const justTextContent = _.find(content, { type: 'text/plain' });
    const contentJustImage = content.filter(resource => resource.type !== 'text/plain');
    const text = !!justTextContent;
    const name = String.t('message.sentByName', { firstName, lastName });
    const childrenNonDeleted = children.filter(msg => !msg.deleted);
    const messageBody = (
      <div>
        <p
          className={classNames(
            'message__body-name',
            createdBy === currentUser.userId ? 'message__inverted_order' : ''
          )}
        >
          {name}
        </p>
        <p className="message__body-text">
          {text && justTextContent.text}
          <span className="message__body-text-date"> ({date})</span>
        </p>
      </div>
    );
    const messageReplyPaddingLeft = classNames({
      'message-nested': level !== 0,
      hide // hide all replies and level 1
    });

    const matchUrl = text ? justTextContent.text.match(/\bhttps?:\/\/\S+/gi) : null;

    return (
      <div className={messageReplyPaddingLeft}>
        <div className={classNames('message__main-container', `border-bottom-${lastRead ? 'red' : ''}`)}>
          <Row
            type="flex"
            justify="start"
            gutter={20}
            className={classNames(createdBy === currentUser.userId ? 'message__inverted_order' : '')}
          >
            <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon">
              <AvatarWrapper key={userId} user={user} size="default" />
            </Col>
            <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
              <div className={classNames('message__Bubble', createdBy === currentUser.userId ? 'right' : 'left')}>
                {messageBody}
                {matchUrl && this.renderMedatada(matchUrl)}
                {contentJustImage.length > 0 && (
                  <div className={classNames(createdBy === currentUser.userId ? 'message__inverted_order' : '')}>
                    <PreviewImages
                      images={contentJustImage}
                      subscriberOrgId={this.props.subscriberOrgId}
                      teamId={this.props.teamId}
                      onLoadImage={this.props.onLoadImages}
                      personalConversation={this.props.personalConversation}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {childrenNonDeleted.length > 0 && (
            <div className="habla-label message__main-counter" onClick={this.handleShowReplies}>
              <span className="message__main-counter-number">{childrenNonDeleted.length}</span>
              <i className="fas fa-reply" data-fa-transform="rotate-180" />
            </div>
          )}
          {lastRead && <div className="message__last-read">{String.t('message.unreadMessageSeparator')}</div>}
          {!conversationDisabled && (
            <div className="message__options hide">
              <Tooltip placement="topLeft" title={String.t('message.tooltipReply')} arrowPointAtCenter>
                <a
                  className="message__icons"
                  onClick={e => {
                    this.handleReplyTo({ firstName, lastName, text, messageId, preferences });
                    e.stopPropagation();
                  }}
                >
                  <i className="fas fa-reply" />
                </a>
              </Tooltip>
              <Tooltip
                placement="topLeft"
                title={String.t(hasBookmark ? 'message.tooltipBookmarkRemove' : 'message.tooltipBookmarkSet')}
                arrowPointAtCenter
              >
                <a
                  className={hasBookmark ? 'message__icons message__icons-selected' : 'message__icons'}
                  onClick={e => {
                    this.handleBookmark(!hasBookmark);
                    e.stopPropagation();
                  }}
                >
                  <i className="fas fa-bookmark" />
                </a>
              </Tooltip>
              {/* <Tooltip placement="topLeft" title={String.t('message.tooltipEdit')} arrowPointAtCenter> */}
              {(isAdmin || message.createdBy === currentUser.userId) && (
                <Popconfirm
                  placement="topRight"
                  title={String.t('message.deleteConfirmationQuestion')}
                  okText={String.t('okButton')}
                  cancelText={String.t('cancelButton')}
                  onConfirm={this.onDeleteConfirmed}
                >
                  <a
                    className="message__icons"
                    /* onClick={() => this.handleEdit()} */
                  >
                    <i className="fas fa-trash-alt" />
                  </a>
                </Popconfirm>
              )}
              {/* </Tooltip> */}
            </div>
          )}
        </div>
        {childrenNonDeleted.length > 0 &&
          teamMembers &&
          childrenNonDeleted.map(childMessage => (
            <Message
              conversationDisabled={conversationDisabled}
              message={childMessage}
              user={teamMembers.find(member => member.userId === childMessage.createdBy)}
              currentUser={this.props.currentUser}
              key={childMessage.messageId}
              onMessageAction={this.props.onMessageAction}
              hide={!this.state.isExpanded}
              currentPath={this.props.currentPath}
              teamMembers={this.props.teamMembers}
              subscriberOrgId={this.props.subscriberOrgId}
              teamId={this.props.teamId}
              isAdmin={isAdmin}
            />
          ))}
      </div>
    );
  }
}

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
