import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import './styles/style.css';

const ResultsList = ({ columns, dataSource, rowKey }) => (
  <Table
    columns={columns}
    dataSource={dataSource}
    pagination={false}
    className="ResultsList"
    rowClassName="ResultsList__row"
    rowKey={rowKey}
  />
);

ResultsList.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  rowKey: PropTypes.string
};

ResultsList.defaultProps = {
  columns: [],
  dataSource: [],
  rowKey: null
};

export default ResultsList;
