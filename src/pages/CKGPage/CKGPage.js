import React from 'react';
import PropTypes from 'prop-types';

import { CKG } from 'src/containers';
import { CKG_VIEWS } from 'src/actions';
import './styles/style.css';

const CKGPage = ({ orgId }) => {
  const menuPageHeader = [
    {
      icon: 'fas fa-chart-area',
      title: 'graphViewsSelector.timeActivity',
      url: `/app/ckg/${orgId}#${CKG_VIEWS.TIME_ACTIVITY}`
    },
    {
      icon: 'fas fa-list-ul',
      title: 'graphViewsSelector.smartListView',
      url: `/app/ckg/${orgId}#${CKG_VIEWS.FILE_LIST}`
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'graphViewsSelector.dashboard',
      url: '',
      submenu: [
        {
          title: 'graphViewsSelector.industryLabel',
          url: '',
          className: 'submenuTitle'
        },
        {
          icon: 'fas fa-chart-bar',
          title: 'graphViewsSelector.electronics',
          url: '#',
          className: 'disabled'
        },
        {
          icon: 'fas fa-chart-bar',
          title: 'graphViewsSelector.cpg',
          url: '#',
          className: 'disabled'
        },
        {
          icon: 'fas fa-chart-bar',
          title: 'graphViewsSelector.manufacturing',
          url: '/app/dashboard'
        },
        {
          icon: 'fas fa-chart-bar',
          title: 'graphViewsSelector.retail',
          url: '#',
          className: 'disabled'
        },
        {
          icon: 'fas fa-chart-bar',
          title: 'graphViewsSelector.relationshipHeatMap',
          url: '#',
          className: 'disabled'
        }
      ]
    }
  ];

  return (
    <div className="CKGPage">
      <CKG menuOptions={menuPageHeader} />
    </div>
  );
};

CKGPage.propTypes = {
  orgId: PropTypes.string.isRequired
};

export default CKGPage;
