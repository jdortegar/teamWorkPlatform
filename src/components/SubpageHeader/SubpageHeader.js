import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired
};

function SubpageHeader({ breadcrumb }) {
  return (
    <div className="subpage-header-block subpage-header__top">
      <Row className="subpage-header__row" type="flex" align="middle" justify="start">
        <Col span={8}>
          <h1>{breadcrumb}</h1>
        </Col>
        <Col span={8} offset={8}>
          <div style={{ textAlign: 'right' }}>
            <h3>Monthly Subscription <i className="fa fa-cog" /></h3>
          </div>
        </Col>
      </Row>
    </div>
  );
}

SubpageHeader.propTypes = propTypes;

export default SubpageHeader;
