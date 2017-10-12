import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import UserIcon from '../UserIcon';
import PreviewImages from '../PreviewImages';
import './styles/style.css';

class Message extends Component {
  constructor(props) {
    super(props);

    this.handleReplyTo = this.handleReplyTo.bind(this);
  }

  handleReplyTo(user) {
    this.props.replyTo(user);
  }

  render() {
    const { message, user, teamRoomMembersObj } = this.props;
    const { text, messageId, children, level, content } = message;
    const { firstName, lastName, icon, preferences, userId } = user;
    const date = moment(message.created).fromNow();

    const messageBody = (
      <div>
        <p className="message__body-name">{firstName} {lastName}</p>
        <p className="message__body-text">
          {text}
          <span className="message__body-text-date"> ({date})</span>
          <span className="message__body-thumbs-icon"><i className="fa fa-thumbs-o-up" /> 0 <i className="fa fa-thumbs-o-down" /> 0</span>
        </p>
      </div>
    );

    const messageReplyPaddingLeft = classNames({
      'message-nested': level !== 0
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
              {content.length > 1 && <PreviewImages images={content[0]}/>}
            </Col>
            <Col xs={{ span: 4 }} sm={{ span: 5 }} md={{ span: 4 }} className="message__col-icons">
              <a
                className="message__icons"
                onClick={() => this.handleReplyTo({ firstName, lastName, text, messageId, preferences })}
              >
                <i className="fa fa-reply" />
              </a>
              <a className="message__icons"><i className="fa fa-folder-o" /></a>
              <a className="message__icons"><i className="fa fa-bookmark-o" /></a>
              <a className="message__icons"><i className="fa fa-circle-thin" /></a>
            </Col>
          </Row>
          { children.length > 0 &&
            <span className="message__main-counter">{ children.length } <i className="fa fa-sort-desc"></i></span>
          }
        </div>
        { children.length > 0 && children.map(message => {
          const user = teamRoomMembersObj[message.createdBy];
          return <Message message={message}
              user={user}
              key={message.messageId}
              replyTo={this.props.replyTo}
              teamRoomMembersObj={this.props.teamRoomMembersObj} />;
          })
        }
      </div>
    );
  }
}

export default Message;
