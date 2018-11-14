import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import String from 'src/translations';
import { hablaLogoAvatar } from 'src/img';
import { CKG } from 'src/containers';
import { Spinner } from 'src/components';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  org: PropTypes.object.isRequired
};

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

class HomePage extends Component {
  renderActivity() {
    const { org, history } = this.props;

    return (
      <div className="homePage__activity-container margin-top-class-b">
        <div className="homePage__activity-item">
          <div className="homePage__activity-avatar">
            <img src={hablaLogoAvatar} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
          </div>
          <div className="homePage__activity-content-container">
            <div className="homePage__activity-content-header">Habla AI Bot</div>
            <div className="homePage__activity-content-message">
              Welcome to Habla AI. To start using our tool as is best, please{' '}
              <a onClick={() => history.push(`/app/integrations/${org.subscriberOrgId}`)}> add a data integration </a>
              to see your files on the time activity view on the CKG.{' '}
              <a onClick={() => history.push(`/app/organization/${org.subscriberOrgId}`)}>Invite people</a> to your
              teams and start new conversations. We hope that now you spend minutes finding the right data instead of
              searching folders for hours. The Habla Ai Team.
              <span className="homePage__activity-content-date"> ({moment(org.created).fromNow()})</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { org } = this.props;
    if (!org) return <Spinner />;

    return (
      <div className="homePage-main">
        <div className="homepage_graph-container">
          <CKG menuOptions={menuPageHeader} />
        </div>
        <div className="homepage_latest-container">{this.renderActivity()}</div>
      </div>
    );
  }
}

HomePage.propTypes = propTypes;

export default HomePage;
