import React from 'react';
import { Row, Col, Input } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  search: PropTypes.bool,
  handleSearch: PropTypes.func,
  type: PropTypes.string,
};

const defaultProps = {
  search: false,
  handleSearch: null,
  type: 'text'
};

function SimpleHeader(props) {
  return (
    <div className="simple-header-block simple-header__container">
      <Row className="simple-header__row" type="flex" align="middle" justify="start" gutter={20}>
        <Col xs={{ span: 18 }} sm={{ span: 18 }}>
          {
            props.type === 'text' ?
              <h2>{props.text}</h2> :
              props.text
          }
        </Col>
        <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }}>
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
