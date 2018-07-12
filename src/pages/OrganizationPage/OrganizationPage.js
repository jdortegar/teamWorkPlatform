import React, { Component } from 'react';
import PropTypes from 'prop-types';
import String from 'translations';
import config from '../../config/env';
import './styles/style.css';
import { hablaFullBlackLogoIcon } from '../../img';
import SubpageHeader from '../../components/SubpageHeader';
import Spinner from '../../components/Spinner';
import CardView from './CardView';

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

const defaultProps = {
  teams: {
    teamIdsBySubscriberOrgId: {
      ids: []
    }
  }
};

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
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
