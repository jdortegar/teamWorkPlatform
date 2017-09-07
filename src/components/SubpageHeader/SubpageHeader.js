import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  node: PropTypes.node
};

const defaultProps = {
  node: <h3>Account Settings <i className="fa fa-cog" /></h3>
};

function SubpageHeader({ breadcrumb, node }) {
  return (
    <div className="subpage-header-block subpage-header__top">
      <Row className="subpage-header__row" type="flex" align="middle" justify="start" gutter={20}>
        <Col xs={{ span: 24 }} sm={{ span: 16 }}>
          <h2>{breadcrumb}</h2>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
          <div style={{ textAlign: 'right' }}>
            {node}
          </div>
        </Col>
      </Row>
    </div>
  );
}

SubpageHeader.propTypes = propTypes;
SubpageHeader.defaultProps = defaultProps;

export default SubpageHeader;
