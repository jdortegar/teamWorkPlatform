import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { paths } from 'src/routes';
import String from 'src/translations';
import { hablaLogoAvatar } from 'src/img';
import { CKG } from 'src/containers';
import { Spinner } from 'src/components';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  org: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  teamId: PropTypes.string.isRequired
};

class TeamPage extends Component {
  componentDidMount = () => {
    if (!this.props.teamId) {
      this.props.history.replace(paths.app);
    }
  };

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
    const { team, org } = this.props;

    if (!team || !org) return <Spinner />;

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
      },
      {
        title: 'TeamPage.teamSettings',
        url: '',
        className: 'submenuTitle'
      },
      {
        icon: 'fas fa-cloud-download-alt',
        title: 'TeamPage.addDataIntegration',
        url: `/app/teamIntegrations/${team.teamId}`
      },
      {
        icon: 'fas fa-cog',
        title: 'TeamPage.manageTeam',
        url: `/app/team/manage/${team.teamId}`
      },
      {
        icon: 'fas fa-pencil-alt',
        title: 'TeamPage.editTeam',
        url: `/app/editTeam/${team.teamId}`
      }
    ];

    return (
      <div className="homePage-main">
        <div className="homepage_graph-container">
          <CKG teamId={team.teamId} showSelector={false} menuOptions={menuPageHeader} />
        </div>
        <div className="homepage_latest-container">{this.renderActivity()}</div>
      </div>
    );
  }
}

TeamPage.propTypes = propTypes;

export default TeamPage;
