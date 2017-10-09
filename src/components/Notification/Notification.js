import React from 'react';
import { Row, Col, Button } from 'antd';
import './styles/style.css';

function Notification(props) {
  return (
    <Row type="flex" className="Notification__container">
      <Col
        xs={{ span: 24 }}
        sm={{ span: 15 }}
        md={{ span: 17 }}
        className="Notification__col Notification__col--vertical-center"
      >
        <h3 className="Notification__title">Team Name invited you to oin subscriber org</h3>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 8 }}
        md={{ span: 6 }}
        className="Notification__col Notification__col--vertical-center Notification__col--horizontal-right"
      >
        <Button
          className="Notification__button Notification__button--gray"
        >
          Accept
        </Button>
        <Button
          className="Notification__button Notification__button--gray"
        >
          Decline
        </Button>
      </Col>
    </Row>
  );
}

export default Notification;
