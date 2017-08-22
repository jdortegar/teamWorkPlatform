import React from 'react';
import { Row, Col } from 'antd';
import UserIcon from '../UserIcon';
import './styles/style.css';

function Message({ message, user }) {
  const { text } = message;
  const { firstName, lastName, icon, preferences, userId } = user;

  let userIcon;

  if (!icon) {
    const name = `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`;
    const title = `${firstName} ${lastName}`;
    userIcon = <UserIcon width="48px" height="48px" key={userId} name={name} bgColor={preferences.iconColor} title={title} />;
  }

  return (
    <Row type="flex" justify="start" gutter={20}>
      <Col xs={{ span: 2 }}>
        {userIcon}
      </Col>
      <Col xs={{ span: 19 }}>
        {text}
      </Col>
      <Col xs={{ span: 3 }} className="message__col-icons">
        <a className="message__icons"><i className="fa fa-reply" /></a>
        <a className="message__icons"><i className="fa fa-folder-o" /></a>
        <a className="message__icons"><i className="fa fa-bookmark-o" /></a>
        <a className="message__icons"><i className="fa fa-circle-thin" /></a>
      </Col>
    </Row>
  );
}

export default Message;
