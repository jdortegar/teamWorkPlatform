import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  onListItemClick: PropTypes.func.isRequired
};

const defaultProps = {
  className: ''
};

function ListViewItem(props) {
  const className = classNames('List-view-item', props.className);

  return (
    <Row type="flex" justify="start" gutter={20} className={className} onClick={props.onListItemClick}>
      <Col span={24}>
        <p className="List-view-item__title">{props.name}</p>
      </Col>
    </Row>
  );
}

ListViewItem.propTypes = propTypes;
ListViewItem.defaultProps = defaultProps;

export default ListViewItem;
