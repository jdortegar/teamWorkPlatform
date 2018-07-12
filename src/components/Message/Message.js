import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Row, Col, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import AvatarWrapper from 'components/common/Avatar/AvatarWrapper';
import PreviewImages from 'containers/PreviewImages';
import './styles/style.css';
import String from '../../translations';

const propTypes = {
  hide: PropTypes.bool,
  currentPath: PropTypes.string,
  conversationDisabled: PropTypes.bool,
  onMessageAction: PropTypes.func.isRequired,
  teamRoomMembersObj: PropTypes.object,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  teamRoomId: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onLoadImages: PropTypes.func,
  lastRead: PropTypes.bool
};

const defaultProps = {
  hide: false,
  conversationDisabled: false,
  teamRoomMembersObj: null,
  onFileChange: null,
  onLoadImages: null,
  lastRead: false,
  currentPath: null
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
    const { message, teamId, teamRoomId } = this.props;
    const extraInfo = { setBookmark };
    const bookmark = { ...message, teamId, teamRoomId };
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

  /*
  handleEdit() {
  } */

  changeVolume() {
    this.setState({
      mute: !this.state.mute
    });
  }

  render() {
    const {
      message,
      user,
      currentUser,
      teamRoomMembersObj,
      hide,
      lastRead,
      conversationDisabled,
      isAdmin
    } = this.props;
    const { messageId, children, level, content } = message;
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
        <p className="message__body-name">{name}</p>
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

    return (
      <div className={messageReplyPaddingLeft}>
        <div className={classNames('message__main-container', `border-bottom-${lastRead ? 'red' : 'lighter'}`)}>
          <Row type="flex" justify="start" gutter={20}>
            <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon">
              <AvatarWrapper key={userId} user={user} size="default" />
            </Col>
            <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
              {messageBody}
              {contentJustImage.length > 0 && (
                <PreviewImages
                  images={contentJustImage}
                  subscriberOrgId={this.props.subscriberOrgId}
                  teamId={this.props.teamId}
                  teamRoomId={this.props.teamRoomId}
                  onLoadImage={this.props.onLoadImages}
                />
              )}
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
              <Tooltip placement="topLeft" title={String.t('message.tooltipThumbsUp')} arrowPointAtCenter>
                <a
                  className="message__icons"
                  onClick={e => {
                    this.handleThumb('up');
                    e.stopPropagation();
                    // e.nativeEvent.stopImmediatePropagation();
                  }}
                >
                  <i className="fas fa-thumbs-up" />
                </a>
              </Tooltip>
              <Tooltip placement="topLeft" title={String.t('message.tooltipThumbsDown')} arrowPointAtCenter>
                <a
                  className="message__icons"
                  onClick={e => {
                    this.handleThumb('down');
                    e.stopPropagation();
                  }}
                >
                  <i className="fas fa-thumbs-down" />
                </a>
              </Tooltip>
              <Tooltip placement="topLeft" title={String.t('message.tooltipFlag')} arrowPointAtCenter>
                <a
                  className="message__icons"
                  onClick={e => {
                    this.handleFlag();
                    e.stopPropagation();
                  }}
                >
                  <i className="fas fa-flag" />
                </a>
              </Tooltip>
              {/* <Tooltip placement="topLeft" title={String.t('message.tooltipEdit')} arrowPointAtCenter> */}
              {(isAdmin || message.createdBy === currentUser.userId) && (
                <Popconfirm
                  title={String.t('message.deleteConfirmationQuestion')}
                  okText={String.t('okButton')}
                  cancelText={String.t('cancelButton')}
                  arrowPointAtCenter
                  onConfirm={this.onDeleteConfirmed}
                >
                  <a
                    className="message__icons"
                    /* onClick={() => this.handleEdit()} */
                  >
                    <i className="fas fa-pencil-alt" />
                  </a>
                </Popconfirm>
              )}
              {/* </Tooltip> */}
            </div>
          )}
        </div>
        {childrenNonDeleted.length > 0 &&
          teamRoomMembersObj &&
          childrenNonDeleted.map(childMessage => (
            <Message
              conversationDisabled={conversationDisabled}
              message={childMessage}
              user={teamRoomMembersObj[childMessage.createdBy]}
              currentUser={this.props.currentUser}
              key={childMessage.messageId}
              onMessageAction={this.props.onMessageAction}
              hide={!this.state.isExpanded}
              currentPath={this.props.currentPath}
              teamRoomMembersObj={this.props.teamRoomMembersObj}
              subscriberOrgId={this.props.subscriberOrgId}
              teamId={this.props.teamId}
              teamRoomId={this.props.teamRoomId}
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
