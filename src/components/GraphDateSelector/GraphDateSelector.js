import React from 'react';
import { Dropdown, Menu } from 'antd';

function GraphDateSelectorMenu() {
  return (
    <Menu className="dateSelectorMenu">
      <div className="habla-label padding-class-a">{String.t('ckgPage.dateLabel')}</div>
      <Menu.Item key="dateSelectorMenuItem">
        <div>
          <span>Add calendar selector here */</span>
        </div>
      </Menu.Item>
    </Menu>
  );
}

export default function GraphDateSelector() {
  return (
    <Dropdown overlay={<GraphDateSelectorMenu />} trigger={['click']}>
      <a>
        <span className="habla-ckg-date-picker-content-text">Aug 9, 2017 - Aug 17, 2017</span>
        <span className="habla-ckg-date-picker-content-icon">
          <i className="fa fa-calendar" />
        </span>
      </a>
    </Dropdown>
  );
}
