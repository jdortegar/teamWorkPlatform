import React from 'react';
import { Row, Col, Icon, Card } from 'antd';
import

function PreviewBar() {
  return (
    <Row type="flex" justify="start" align="middle" gutter={20} className="team-room__message_reply-container">
      <Col xs={{ span: 21 }} style={{ borderLeft: `6px solid ${this.state.replyTo.preferences.iconColor}` }}>
        <p className="team-room__message-body-name">{this.state.replyTo.firstName} {this.state.replyTo.lastName}</p>
        <p className="team-room__message-body-text">
          {this.state.replyTo.text}
        </p>
        <div style={{ display: 'flex' }}>
          <Card extra={<a href="#">X</a>} style={{ width: 96 }}>
            <img alt="example" width="100%" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
          </Card>
        </div>
      </Col>
      <Col xs={{ span: 3 }} className="team-room__message-cancel-reply-col">
        <a className="team-room__message-cancel-reply" onClick={this.onCancelReply} title={messages.cancel}>
          <Icon type="close-circle-o" />
        </a>
      </Col>
    </Row>
  );
}

export default PreviewBar;
