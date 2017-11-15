import React from 'react';
import { Spin } from 'antd';
import './styles/style.css';

const Spinner = () => {
  return (
    <div className="spinner">
      <Spin />
    </div>
  );
};

export default Spinner;
