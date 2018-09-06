import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import './styles/style.css';

const ResultsList = ({ columns, dataSource, pagination, loading, rowKey }) => {
  if (loading) return null;

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      className="ResultsList"
      rowClassName="ResultsList__row"
      rowKey={rowKey}
    />
  );
};

ResultsList.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  loading: PropTypes.bool,
  rowKey: PropTypes.string
};

ResultsList.defaultProps = {
  columns: [],
  dataSource: [],
  pagination: false,
  loading: false,
  rowKey: null
};

export default ResultsList;
