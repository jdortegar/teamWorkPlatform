import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import './styles/style.css';

const ResultsList = ({ columns, dataSource, loading, rowKey }) => {
  if (loading) return null;

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      className="ResultsList"
      rowClassName="ResultsList__row"
      rowKey={rowKey}
    />
  );
};

ResultsList.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  rowKey: PropTypes.string
};

ResultsList.defaultProps = {
  columns: [],
  dataSource: [],
  loading: false,
  rowKey: null
};

export default ResultsList;
