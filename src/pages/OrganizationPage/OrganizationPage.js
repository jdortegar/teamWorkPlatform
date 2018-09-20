import React, { Component } from 'react';
import PropTypes from 'prop-types';
import String from 'translations';
import classNames from 'classnames';
import config from '../../config/env';
import './styles/style.css';
import { hablaFullBlackLogoIcon } from '../../img';
import SubpageHeader from '../../components/SubpageHeader';
import Spinner from '../../components/Spinner';
import CardView from './CardView';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Avatar from '../../components/common/Avatar';
import ProgressBar from '../../components/common/ProgressBar';

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
      let isOrgAdmin = false;
      if (subscribers.length > 0) {
        const currentUserId = user.userId;
        const subscriberByMyUser = subscribers.find(subscriber => subscriber.userId === currentUserId);
        isOrgAdmin = subscriberByMyUser.subscriberOrgs[subscriberOrgId].role === 'admin';
      }

      const subscriberOrg = subscriberOrgs.subscriberOrgById[subscriberOrgId];

      const editButton = {
        showButton: true,
        isAdmin: isOrgAdmin, // this is gonna change later
        url: `/app/editOrganization/${subscriberOrgId}`
      };
      return (
        <div className="editOrgPage-main">
          <SubpageHeader
            subscriberOrgId={subscriberOrg.subscriberOrgId}
            history={this.props.history}
            editButton={editButton}
            breadcrumb={
              <div>
                <i className="fas fa-cog" />
                {String.t('OrganizationPage.title')}
              </div>
            }
          />
          <SimpleCardContainer className="subpage-block habla-color-blue align-center-class">
            {renderAvatar(subscriberOrg, subscriberOrg.enabled, 'x-large')}
            <div className="mt-2">
              <h1 className="habla-organization-title">{subscriberOrg.name}</h1>
            </div>
          </SimpleCardContainer>
          <SimpleCardContainer className="subpage-block habla-color-lightblue padding-class-a align-center-class habla-white">
            {/* To do: make this dynamic */}
            <div>
              <span className="mr-5">
                <i className="fas fa-check mr-05 habla-lighertblue" />
                {String.t('OrganizationPage.occupiedSpace', { occupied: 18, remain: 50 })}
              </span>
              <span>
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
