import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired
};

const defaultProps = {
  className: ''
}

function ListViewItem(props) {
  const className = classNames('List-view-item', props.className);

  return (
    <Row type="flex" justify="start" gutter={20} className={className}>
      <Col span={24}>
        {props.name}
      </Col>
    </Row>
  );
}

ListViewItem.propTypes = propTypes;
ListViewItem.defaultProps = defaultProps;

export default ListViewItem;
