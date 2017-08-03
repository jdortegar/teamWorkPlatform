import React from 'react';
import { Row, Col } from 'antd';
import './styles/style.css';

function SubpageHeader() {
  return (
    <div className="subpage-header-block subpage-header__top">
      <Row className="subpage-header__row" type="flex" align="middle" justify="start">
        <Col span={8}>
          <h1>Nintendo</h1>
        </Col>
        <Col span={8} offset={8}>
          <div style={{ textAlign: 'right' }}>
            <h3>Monthly Subscription <i className="fa fa-cog" aria-hidden="true" /></h3>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SubpageHeader;
