import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import UserIcon from '../UserIcon';
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
    const { message, user } = this.props;
    const { text, messageId } = message;
    const { firstName, lastName, icon, preferences, userId } = user;
    const date = moment(message.created).fromNow();

    let userIcon;
    const title = `${firstName} ${lastName}`;

    if (!icon) {
      const name = `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`;
      userIcon = <UserIcon minWidth="48px" width="48px" height="48px" key={userId} name={name} bgColor={preferences.iconColor} title={title} />;
    } else {
      userIcon = <UserIcon type="icon" minWidth="48px" width="48px" height="48px" key={userId} title={title} icon={icon} />;
    }

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

    return (
      <div className="message__main-container">
        <Row type="flex" justify="start" gutter={20}>
          <Col xs={{ span: 5 }} sm={{ span: 3 }} md={{ span: 2 }} className="message__col-user-icon">
            {userIcon}
          </Col>
          <Col xs={{ span: 15 }} sm={{ span: 16 }} md={{ span: 18 }}>
            {messageBody}
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
      </div>
    );
  }
}

export default Message;
