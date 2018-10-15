import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

import String from 'src/translations';
import './styles/style.css';

const GraphViewSelector = ({ currentSubscriberOrgId }) => {
  const menu = (
    <Menu>
      <Menu.Item key="graphSelector">
        <div className="habla-label padding-class-a">{String.t('graphViewsSelector.label')}</div>
      </Menu.Item>
      <Menu.Item key="graphViewCKG">
        <Link to={`/app/ckg/${currentSubscriberOrgId}`}>
          <span>
            <i className="fas fa-chart-area" /> {String.t('graphViewsSelector.timeActivity')}
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="fileLineage">
        <a>
          <span>
            <i className="fas fa-clone" /> {String.t('graphViewsSelector.fileLineage')}
          </span>
        </a>
      </Menu.Item>
      <Menu.Item key="conceptMap">
        <a>
          <span>
            <i className="fas fa-bullseye" /> {String.t('graphViewsSelector.conceptMap')}
          </span>
        </a>
      </Menu.Item>
      <Menu.SubMenu title={String.t('graphViewsSelector.dashboard')}>
        <div className="habla-label padding-class-a">{String.t('graphViewsSelector.industryLabel')}</div>
        <Menu.Item>
          <a>
            <span>
              <i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.cpg')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a>
            <span>
              <i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.electronics')}
            </span>
          </a>
        </Menu.Item>
        <Menu.Item>
          <Link to="/app/dashboard">
            <span>
              <i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.manufacturing')}
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a>
            <span>
              <i className="fas fa-chart-bar" /> {String.t('graphViewsSelector.retail')}
            </span>
          </a>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="graphViewSelectorLink">
        <i className="fas fa-bars fa-2x" />
        <i className="fas fa-chevron-down" />
      </a>
    </Dropdown>
  );
};

GraphViewSelector.propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired
};

export default GraphViewSelector;
