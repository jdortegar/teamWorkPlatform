import React from 'react';
import { Row, Col, Input, Icon } from 'antd';
import './styles/style.css';

function SubpageHeader() {
  return (
    <div>
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
      <div className="subpage-header-block subpage-header__bottom">
        <Row className="subpage-header__row" type="flex" align="middle" justify="start">
          <Col xs={{ span: 17 }} sm={{ span: 14 }}>
            <h2>Your Data Integrations (2)</h2>
          </Col>
          <Col xs={{ span: 6, offset: 1 }} sm={{ span: 6, offset: 4 }} md={{ span: 4, offset: 6 }}>
            <Input
              placeholder="Search"
              prefix={<i className="fa fa-search" aria-hidden="true" />}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default SubpageHeader;
