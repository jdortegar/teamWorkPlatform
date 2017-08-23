import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import UserIcon from '../UserIcon';
import './styles/style.css';

function Message({ message, user }) {
  const { text } = message;
  const { firstName, lastName, icon, preferences, userId } = user;
  const date = moment(message.created).fromNow();

  let userIcon;

  if (!icon) {
    const name = `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`;
    const title = `${firstName} ${lastName}`;
    userIcon = <UserIcon minWidth="48px" width="48px" height="48px" key={userId} name={name} bgColor={preferences.iconColor} title={title} />;
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
        <Col xs={{ span: 16 }} sm={{ span: 18 }} md={{ span: 19 }}>
          {messageBody}
        </Col>
        <Col xs={{ span: 3 }} className="message__col-icons">
          <a className="message__icons"><i className="fa fa-reply" /></a>
          <a className="message__icons"><i className="fa fa-folder-o" /></a>
          <a className="message__icons"><i className="fa fa-bookmark-o" /></a>
          <a className="message__icons"><i className="fa fa-circle-thin" /></a>
        </Col>
      </Row>
    </div>
  );
}

export default Message;
