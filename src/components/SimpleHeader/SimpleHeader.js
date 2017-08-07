import React from 'react';
import { Row, Col, Input } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  text: PropTypes.string.isRequired,
  search: PropTypes.bool,
  handleSearch: PropTypes.func
};

const defaultProps = {
  search: false,
  handleSearch: null
};

function SimpleHeader(props) {
  return (
    <div className="simple-header-block simple-header__container">
      <Row className="simple-header__row" type="flex" align="middle" justify="start">
        <Col xs={{ span: 17 }} sm={{ span: 14 }}>
          <h2>{props.text}</h2>
        </Col>
        <Col xs={{ span: 6, offset: 1 }} sm={{ span: 6, offset: 4 }} md={{ span: 4, offset: 6 }}>
          {
            props.search ?
              <Input
                onChange={e => props.handleSearch(e.target.value)}
                placeholder="Search"
                prefix={<i className="fa fa-search" aria-hidden="true" />}
              /> : null
          }
        </Col>
      </Row>
    </div>
  );
}

SimpleHeader.propTypes = propTypes;
SimpleHeader.defaultProps = defaultProps;

export default SimpleHeader;
