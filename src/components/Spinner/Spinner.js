import React from 'react';
import { Spin, Icon } from 'antd';
import './styles/style.css';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Spinner = () => (
  <div className="spinner">
    <Spin indicator={antIcon} />
  </div>
);

export default Spinner;
