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
    integrationsBySubscriberOrgId: PropTypes.object
  }).isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.shape({
    currentSubscriberOrgId: PropTypes.string
  }).isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  fetchSubscribersBySubscriberOrgId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string
    })
  }).isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
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
  constructor(props) {
    super(props);

    this.state = { integrationsLoaded: false, subscribersLoaded: false };
  }

  componentDidMount() {
    const { match, subscriberOrgs } = this.props;
    if (
      !match ||
      !match.params ||
      !match.params.subscriberOrgId ||
      match.params.subscriberOrgId !== subscriberOrgs.currentSubscriberOrgId
    ) {
      this.props.history.replace('/app');
      return;
    }
    const { subscriberOrgId } = this.props.match.params;

    if (subscriberOrgId !== this.props.subscriberOrgs.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }

    this.props
      .fetchSubscribersBySubscriberOrgId(subscriberOrgId)
      .then(() => this.setState({ subscribersLoaded: true }));
    this.props.fetchIntegrations(subscriberOrgId).then(() => {
      this.setState({ integrationsLoaded: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    const nextOrgId = nextProps.match.params.subscriberOrgId;
    if (nextOrgId !== this.props.match.params.subscriberOrgId) {
      this.setState({
        integrationsLoaded: false,
        subscribersLoaded: false
      });
      this.props.fetchSubscribersBySubscriberOrgId(nextOrgId).then(() => this.setState({ subscribersLoaded: true }));
      this.props.fetchIntegrations(nextOrgId).then(() => {
        this.setState({ integrationsLoaded: true });
      });
    }
  }

  render() {
    const { teams, integrations, subscribers, subscribersPresences, subscriberOrgs, user, match } = this.props;
    if (
      match &&
      match.params &&
      match.params.subscriberOrgId &&
      subscribers &&
      subscribersPresences &&
      subscriberOrgs &&
      subscriberOrgs.subscriberOrgById &&
      subscriberOrgs.subscriberOrgById[match.params.subscriberOrgId] &&
      teams &&
      integrations &&
      this.state.subscribersLoaded &&
      this.state.integrationsLoaded &&
      user
    ) {
      const { subscriberOrgId } = match.params;
      const subscriberOrg = subscriberOrgs.subscriberOrgById[subscriberOrgId];

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
          title: 'OrganizationPage.manageTeams',
          url: `/app/editOrganization/${subscriberOrgId}/teams`
        },
        {
          icon: 'fas fa-pencil-alt',
          title: 'OrganizationPage.editSection',
          url: `/app/editOrganization/${subscriberOrgId}`
        }
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
            subscriberOrgId={subscriberOrgId}
            teams={teams}
            user={user}
          />
          <div className="app-version">
            <img src={hablaFullBlackLogoIcon} alt="habla.ai" />
            HABLA.AI - {config.hablaApiEnv !== 'prod' ? config.hablaApiEnv.toUpperCase() : 'APP'}{' '}
            {config.hablaWebAppVersion}
          </div>
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationPage.propTypes = propTypes;

export default OrganizationPage;
