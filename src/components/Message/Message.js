import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Tooltip } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import UserIcon from '../UserIcon';
import PreviewImages from '../PreviewImages';
import './styles/style.css';

export default class Message extends Component {
  constructor(props) {
    super(props);
    // console.log(props);

    this.state = {
      mute: true,
      isClosed: true,
    };

    this.handleReplyTo = this.handleReplyTo.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.handleShowReplies = this.handleShowReplies.bind(this);
  }

  handleShowReplies() {
    this.setState({
      isClosed: !this.state.isClosed,
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
    const { message, user, teamRoomMembersObj, hide } = this.props;
    const { text, messageId, children, level, content } = message;
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

    const contentJustImage = content.filter(resource => resource.type !== 'text/plain');

    const messageBody = (
      <div>
        <p className="message__body-name">{firstName} {lastName}</p>
        <p className="message__body-text">
          {text}
          <span className="message__body-text-date"> ({date})</span>
        </p>
      </div>
    );

    const messageReplyPaddingLeft = classNames({
      'message-nested': level !== 0,
      hide: hide // hide all replies and level 1
    });

    return (
      <div className={messageReplyPaddingLeft}>
        <div className="message__main-container">
          <Row type="flex" justify="start" gutter={20}>
            <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon">
              <UserIcon user={user} type="user" minWidth="48px" width="48px" height="48px" key={userId} />
            </Col>
            <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
              {messageBody}
              {contentJustImage.length > 0 && <PreviewImages images={contentJustImage} />}
            </Col>
          </Row>
          { children.length > 0 &&
            <span className="message__main-counter">{ children.length }
              <i onClick={this.handleShowReplies} className="counter fa fa-sort-desc"></i>
            </span>
          }
          <div className="message__options hide">
            <Tooltip placement="topLeft" title="Reply" arrowPointAtCenter>
              <a
                className="message__icons"
                onClick={() => this.handleReplyTo({ firstName, lastName, text, messageId, preferences })}>
                <i className="fa fa-reply" />
              </a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Add File(s)" arrowPointAtCenter>
              <input
                id="replyFileUpload"
                className="team-room__file-upload-input"
                type="file"
                onChange={this.props.onFileChange}
                multiple
              />
              <label htmlFor="replyFileUpload" className="team-room__icons">
                <a
                  className="message__icons"
                  onClick={() => this.handleReplyTo({ firstName, lastName, text, messageId, preferences })}>
                  <i className="fa fa-folder-o" />
                </a>
              </label>
            </Tooltip>
            <Tooltip placement="topLeft" title="Bookmark" arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-bookmark-o" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Thumbs Up" arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-thumbs-o-up" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Thumbs Down" arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-thumbs-o-down" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Flag" arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-flag" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Mute" arrowPointAtCenter>
              <a onClick={this.changeVolume} className={mute}><i className="fa fa-volume-up" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Unmute" arrowPointAtCenter>
              <a onClick={this.changeVolume} className={unmute}><i className="fa fa-volume-off" /></a>
            </Tooltip>
            <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
              <a className="message__icons"><i className="fa fa-pencil" /></a>
            </Tooltip>
          </div>
        </div>
        { children.length > 0 && children.map(childMessage =>
          <Message
            message={childMessage}
            user={teamRoomMembersObj[childMessage.createdBy]}
            key={childMessage.messageId}
            replyTo={this.props.replyTo}
            hide={this.state.isClosed}
            teamRoomMembersObj={this.props.teamRoomMembersObj}
          />
        )}
      </div>
    );
  }
}

Message.propTypes = {
  hide: PropTypes.bool.isRequired,
  replyTo: PropTypes.func.isRequired,
  onFileChange: PropTypes.func,
  teamRoomMembersObj: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
