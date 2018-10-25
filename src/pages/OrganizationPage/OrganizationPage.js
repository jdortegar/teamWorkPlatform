import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import String from 'src/translations';
import config from 'src/config/env';
import { hablaFullBlackLogoIcon } from 'src/img';
import { PageHeader, SimpleCardContainer, Spinner, ProgressBar } from 'src/components';
import Avatar from 'src/components/common/Avatar';
import CardView from './CardView';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.PropTypes.shape({
    byOrg: PropTypes.object
  }).isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.shape({
    currentSubscriberOrgId: PropTypes.string
  }).isRequired,
  fetchSubscribersBySubscriberOrgId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired
};

// Get subscriber avatar or Initials
function renderAvatar(item, enabled, size) {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': !enabled,
    'border-white-2': true
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} size={size} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} size={size} />;
  }
  const nameInitial = item.name.substring(0, 1).toUpperCase();
  return (
    <Avatar color={preferences.iconColor} className={className} size={size}>
      {nameInitial}
    </Avatar>
  );
}

class OrganizationPage extends Component {
  state = {
    integrationsLoaded: false,
    subscribersLoaded: false
  };

  componentDidMount() {
    const { orgId, history, fetchSubscribersBySubscriberOrgId, fetchIntegrations } = this.props;

    if (!orgId) {
      history.replace('/app');
      return;
    }

    fetchSubscribersBySubscriberOrgId(orgId).then(() => this.setState({ subscribersLoaded: true }));
    fetchIntegrations().then(() => this.setState({ integrationsLoaded: true }));
  }

  render() {
    const { teams, integrations, subscribers, subscribersPresences, subscriberOrgs, user, orgId } = this.props;
    if (
      subscribers &&
      subscribersPresences &&
      subscriberOrgs &&
      subscriberOrgs.subscriberOrgById &&
      subscriberOrgs.subscriberOrgById[orgId] &&
      teams &&
      integrations &&
      this.state.subscribersLoaded &&
      this.state.integrationsLoaded &&
      user
    ) {
      const subscriberOrg = subscriberOrgs.subscriberOrgById[orgId];

      // Breadcrumb
      const pageBreadCrumb = {
        subscriberOrg,
        routes: [
          {
            title: String.t('OrganizationPage.title')
          }
        ]
      };

      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-cog',
          title: 'OrganizationPage.addNewTeam',
          url: `/app/createTeam/${orgId}`
        }
        // {
        //   icon: 'fas fa-cog',
        //   title: 'OrganizationPage.manageTeamMembers',
        //   url: `/app/editOrganization/${orgId}/members`
        // },
        // {
        //   icon: 'fas fa-cog',
        //   title: 'OrganizationPage.manageDataIntegrations',
        //   url: `/app/editOrganization/${orgId}/dataIntegrations`
        // },
        // {
        //   icon: 'fas fa-pencil-alt',
        //   title: 'OrganizationPage.editSection',
        //   url: `/app/editOrganization/${orgId}`
        // }
      ];

      return (
        <div className="editOrgPage-main">
          <PageHeader pageBreadCrumb={pageBreadCrumb} hasMenu menuName="settings" menuPageHeader={menuPageHeader} />
          <SimpleCardContainer className="subpage-block habla-color-blue align-center-class">
            {renderAvatar(subscriberOrg, subscriberOrg.enabled, 'x-large')}
            <div className="mt-2">
              <h1 className="habla-organization-title">{subscriberOrg.name}</h1>
            </div>
          </SimpleCardContainer>
          <SimpleCardContainer className="subpage-block habla-color-lightblue padding-class-a align-center-class habla-white">
            {/* To do: make this dynamic */}
            <div>
              <span className="mr-5 habla-light-text">
                <i className="fas fa-check mr-05 habla-lighertblue" />
                {String.t('OrganizationPage.occupiedSpace', { occupied: 18, remain: 50 })}
              </span>
              <span className="habla-light-text">
                <i className="fas fa-file-alt mr-05 habla-lighertblue" />
                {String.t('OrganizationPage.filesShared', { count: 17389 })}
              </span>
            </div>
            <ProgressBar strokeColor="#384f83" percent={30} />
          </SimpleCardContainer>
          <CardView
            integrations={integrations}
            subscribers={subscribers}
            subscribersPresences={subscribersPresences}
            orgId={orgId}
            teams={teams}
            user={user}
          />
          <div className="app-version-container">
            <div className="app-version">
              <img src={hablaFullBlackLogoIcon} alt="habla.ai" />
              HABLA.AI - {config.hablaApiEnv !== 'prod' ? config.hablaApiEnv.toUpperCase() : 'APP'}{' '}
              {config.hablaWebAppVersion}
            </div>
          </div>
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationPage.propTypes = propTypes;

export default OrganizationPage;
