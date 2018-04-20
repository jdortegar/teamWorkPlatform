import React from 'react';
import { Menu, Dropdown } from 'antd';

import String from 'translations';
import './styles/style.css';

const GraphViewSelector = () => {
  const menu = (
    <Menu>
      <Menu.Item key="graphSelector">
        <div className="habla-label padding-class-a">{String.t('graphViewsSelector.label')}</div>
      </Menu.Item>
      <Menu.Item key="graphViewCKG">
        <a><span><i className="fas fa-chart-area" /> {String.t('graphViewsSelector.ckg')}</span></a>
      </Menu.Item>
      <Menu.Item key="fileLineage">
        <a><span><i className="fas fa-clone" /> {String.t('graphViewsSelector.fileLineage')}</span></a>
      </Menu.Item>
      <Menu.Item key="conceptMap">
        <a><span><i className="fas fa-bullseye" /> {String.t('graphViewsSelector.conceptMap')}</span></a>
      </Menu.Item>
      <Menu.SubMenu title={String.t('graphViewsSelector.dashboard')}>
        <div className="habla-label padding-class-a">{String.t('graphViewsSelector.dashboardLabel')}</div>
        <Menu.Item><a><span><i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.cpg')}</span></a></Menu.Item>
        <Menu.Item><a><span><i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.electronics')}</span></a></Menu.Item>
        <Menu.Item><a><span><i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.manufacturing')}</span></a></Menu.Item>
        <Menu.Item><a><span><i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.retail')}</span></a></Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="graphViewSelectorLink">
        <i className="fas fa-chart-area fa-2x" />
        <i className="fas fa-chevron-down" />
      </a>
    </Dropdown>
  );
};

export default GraphViewSelector;
