import React from 'react';
import { Dropdown, Menu } from 'antd';

import String from '../../translations';
import '../../pages/CKGPage/styles/style.css';

const GraphActivitySelector = () => {
  const activityMenu = (
    <Menu className="activitySelectorMenu">
      <a className="habla-label padding-class-a">{String.t('graphActivityMenu.activityLabel')}</a>
      <Menu.Item key="allActivity">
        <a><span><i className="fas fa-tasks" /> {String.t('graphActivityMenu.allActivity')}</span></a>
      </Menu.Item>
      <Menu.Item key="viewActivity">
        <a><span><i className="fas fa-eye" /> {String.t('graphActivityMenu.viewsActivity')}</span></a>
      </Menu.Item>
      <Menu.Item key="shareActivity" className="dropdown-last-menu-item">
        <a><span><i className="fas fa-share" /> {String.t('graphActivityMenu.sharesActivity')}</span></a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="habla-ckg-tools-bar habla-ckg-activity-selector">
      <Dropdown overlay={activityMenu} trigger={['click']}>
        <a className="no-border">
          <i className="fas fa-tasks" />
          <span className="ckg-activity-label">{String.t('graphActivityMenu.allActivity')}</span>
          <i className="fas fa-angle-down" />
        </a>
      </Dropdown>
    </div>
  );
};

export default GraphActivitySelector;
