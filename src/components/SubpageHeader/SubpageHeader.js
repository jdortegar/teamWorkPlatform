import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  breadcrumb: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  node: PropTypes.node,
  icon: PropTypes.node.isRequired
};

const defaultProps = {
  node: <h3>Account Settings <i className="fa fa-cog" /></h3>
};

function SubpageHeader({ breadcrumb, node, icon }) {
  return (
    <div className="Subpage-header-block subpage-header__top">
      <Row className="Subpage-header__row" type="flex" align="middle" justify="start">
        <Col xs={{ span: 24 }} sm={{ span: 19 }}>
          <div className="Subpage-header__container">
            {icon}
            <h1 className="Subpage-header__title">{breadcrumb}</h1>
          </div>
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 5 }}>
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
