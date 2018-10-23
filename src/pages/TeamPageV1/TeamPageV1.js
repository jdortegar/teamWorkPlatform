import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import String from 'src/translations';
import { hablaLogoAvatar } from 'src/img';
import { CKGPage } from 'src/containers';
import { PageHeader, Spinner } from 'src/components';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string,
      status: PropTypes.string
    })
  }).isRequired,
  teams: PropTypes.object.isRequired
};

class TeamPageV1 extends Component {
  state = {
    // TODO: This is temporary... we'll need an API to get activity
    activity: [
      {
        logo: hablaLogoAvatar,
        from: 'Habla AI Bot',
        text: `Welcome to Habla AI. <a href="/app/ckg/${
          this.props.currentSubscriberOrgId
        }>Click here</a> to start integrating data into your Knowledge Graph.`,
        created: null
      }
    ]
  };

  renderActivity() {
    // TODO: This is temporary... get and show the date that the subscriberOrg was created
    const { currentSubscriberOrgId, subscriberOrgById } = this.props;
    const org = subscriberOrgById[currentSubscriberOrgId];
    const date = moment(org.created).fromNow();

    return this.state.activity.map(({ logo, from }) => (
      <div key={date} className="homePage__activity-container margin-top-class-b">
        <div className="homePage__activity-item">
          <div className="homePage__activity-avatar">
            <img src={logo} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
          </div>
          <div className="homePage__activity-content-container">
            <div className="homePage__activity-content-header">{from}</div>
            <div className="homePage__activity-content-message">
              Welcome to Habla AI. To start using our tool as is best, please{' '}
              <a onClick={() => this.props.history.push(`/app/integrations/${this.props.currentSubscriberOrgId}`)}>
                {' '}
                add a data integration{' '}
              </a>
              to see your files on the time activity view on the CKG.{' '}
              <a onClick={() => this.props.history.push(`/app/organization/${this.props.currentSubscriberOrgId}`)}>
                Invite people
              </a>{' '}
              to your teams and start new conversations. We hope that now you spend minutes finding the right data
              instead of searching folders for hours. The Habla Ai Team.
              <span className="homePage__activity-content-date"> ({date})</span>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    const { match, teams, subscriberOrgById } = this.props;

    if (match && match.params && match.params.teamId && teams[match.params.teamId] && subscriberOrgById) {
      const { teamId } = match.params;

      const { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId, currentSubscriberOrgId } = this.props;

      if (!subscriberOrgById || !subscriberOrgById[currentSubscriberOrgId]) {
        return <Spinner />;
      }
      const subscriberOrgId = this.props.currentSubscriberOrgId;
      const params = { params: { subscriberOrgId } };

      // V1

      const team = teams[teamId];

      // Breadcrumb
      const pageBreadCrumb = {
        routes: [
          {
            title: team.name,
            url: `/app/team/${subscriberOrgId}`
          },
          {
            title: String.t('graphViewsSelector.timeActivity')
          }
        ]
      };

      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-chart-area',
          title: 'graphViewsSelector.timeActivity',
          url: ''
        },
        // {
        //   icon: 'fas fa-bullseye',
        //   title: 'graphViewsSelector.teamMemberContribution',
        //   url: ''
        // },
        // {
        //   icon: 'fas fa-clone',
        //   title: 'graphViewsSelector.fileLineage',
        //   url: ''
        // },
        // {
        //   icon: 'fas fa-sitemap',
        //   title: 'graphViewsSelector.relationshipHeatMap',
        //   url: ''
        // },
        // {
        //   icon: 'fas fa-bars',
        //   title: 'graphViewsSelector.smartListView',
        //   url: ''
        // },
        // {
        //   icon: 'fas fa-stop',
        //   title: 'graphViewsSelector.customGraph',
        //   url: ''
        // },
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
          url: `/app/teamIntegrations/${teamId}`
        },
        {
          icon: 'fas fa-cog',
          title: 'TeamPage.manageTeam',
          url: `/app/team/manage/${teamId}`
        },
        {
          icon: 'fas fa-pencil-alt',
          title: 'TeamPage.editTeam',
          url: `/app/editTeam/${teamId}`
        }
      ];

      return (
        <div className="homePage-main">
          <PageHeader
            subscriberOrgId={subscriberOrgId}
            pageBreadCrumb={pageBreadCrumb}
            hasMenu
            menuName="settings"
            menuPageHeader={menuPageHeader}
          />
          <div className="homepage_graph-container">
            <CKGPage
              history={this.props.history}
              match={params}
              currentSubscriberOrgId={subscriberOrgId}
              fetchTimeActivitiesBySubscriberOrgId={fetchTimeActivitiesBySubscriberOrgId}
              setCurrentSubscriberOrgId={setCurrentSubscriberOrgId}
              showHeader={false}
            />
          </div>
          <div className="homepage_latest-container">{this.renderActivity()}</div>
        </div>
      );
    }
    return <Spinner />;
  }
}

TeamPageV1.propTypes = propTypes;

export default TeamPageV1;
