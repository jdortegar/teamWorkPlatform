import React from 'react';
import String from 'src/translations';
import { CKG } from 'src/containers';
import { PageHeader } from 'src/components';
import './styles/style.css';

// Page Menu
const menuPageHeader = [
  {
    icon: 'fas fa-chart-area',
    title: 'graphViewsSelector.timeActivity',
    url: ''
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

const CKGPage = () => (
  <div className="CKGPage">
    <PageHeader
      pageBreadCrumb={{
        routes: [{ title: String.t('graphViewsSelector.timeActivity') }]
      }}
      hasMenu
      menuName="settings"
      menuPageHeader={menuPageHeader}
    />
    <CKG />
  </div>
);

export default CKGPage;
