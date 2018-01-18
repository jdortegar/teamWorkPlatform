import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import UserIcon from '../UserIcon';
import PreviewImages from '../PreviewImages';
import './styles/style.css';
import String from '../../translations';

const propTypes = {
  hide: PropTypes.bool.isRequired,
  replyTo: PropTypes.func.isRequired,
  teamRoomMembersObj: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  subscriberOrgId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  teamRoomId: PropTypes.string.isRequired,
  lastRead: PropTypes.bool
};

const defaultProps = {
  onFileChange: null,
  lastRead: false
};

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mute: true,
      isClosed: true
    };

    this.handleReplyTo = this.handleReplyTo.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.handleShowReplies = this.handleShowReplies.bind(this);
  }

  handleShowReplies() {
    this.setState({
      isClosed: !this.state.isClosed
    });
  }

  handleReplyTo(user) {
    this.props.replyTo(user);
  }

  changeVolume() {
    this.setState({
      mute: !this.state.mute
    });
  }

  render() {
    const { message, user, teamRoomMembersObj, hide, lastRead } = this.props;
    const { messageId, children, level, content } = message;
    const { firstName, lastName, preferences, userId } = user;
    const date = moment(message.created).fromNow();
    const unmute = classNames({
      message__icons: true,
      hide: this.state.mute
    });
    const mute = classNames({
      message__icons: true,
      hide: !this.state.mute
    });

    const justTextContent = _.find(content, { type: 'text/plain' });
    const contentJustImage = content.filter(resource => resource.type !== 'text/plain');
    const text = !!justTextContent;
    const name = String.t('message.sentByName', { firstName, lastName });
    const messageBody = (
      <div>
        <p className="message__body-name">{name}</p>
        <p className="message__body-text">
          { text && justTextContent.text }
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
              <UserIcon user={user} type="user" minWidth="2.5em" width="2.5em" height="2.5em" key={userId} />
            </Col>
            <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
              {messageBody}
              {contentJustImage.length > 0 && (
                <PreviewImages
                  images={contentJustImage}
                  subscriberOrgId={this.props.subscriberOrgId}
                  teamId={this.props.teamId}
                  teamRoomId={this.props.teamRoomId}
                />
              )}
            </Col>
          </Row>
          { children.length > 0 &&
          <div className="habla-label message__main-counter" onClick={this.handleShowReplies}>
            <span className="message__main-counter-number" >
              { children.length }
            </span>
            <i className="counter fa fa-reply fa-rotate-180" />
          </div>
          }
          { lastRead && <div className="message__last-read"><span>New</span></div> }
          <div className="message__options hide">
            <Tooltip placement="topLeft" title={String.t('message.tooltipReply')} arrowPointAtCenter>
              <a
                className="message__icons"
                onClick={() => this.handleReplyTo({ firstName, lastName, text, messageId, preferences })}
              >
                <i className="fa fa-reply" />
              </a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipBookmark')} arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-bookmark-o" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipThumbsUp')} arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-thumbs-o-up" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipThumbsDown')} arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-thumbs-o-down" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipFlag')} arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-flag" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipMute')} arrowPointAtCenter>
              <a onClick={this.changeVolume} className={mute}><i className="fa fa-volume-up" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipUnmute')} arrowPointAtCenter>
              <a onClick={this.changeVolume} className={unmute}><i className="fa fa-volume-off" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title={String.t('message.tooltipEdit')} arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-pencil" /></a>
            </Tooltip>
          </div>
        </div>
        { children.length > 0 && children.map(childMessage => (
          <Message
            message={childMessage}
            user={teamRoomMembersObj[childMessage.createdBy]}
            key={childMessage.messageId}
            replyTo={this.props.replyTo}
            hide={this.state.isClosed}
            teamRoomMembersObj={this.props.teamRoomMembersObj}
          />)
        )}
      </div>
    );
  }
}

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
