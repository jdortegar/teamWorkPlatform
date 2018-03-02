import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';
import BreadCrumb from '../../components/BreadCrumb';
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

    this.state = { integrationsLoaded: false, subscribersLoaded: false, view: 'card' };
  }

  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;

    if (subscriberOrgId !== this.props.subscriberOrgs.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }

    this.props.fetchSubscribersBySubscriberOrgId(subscriberOrgId).then(() => this.setState({ subscribersLoaded: true }));
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
    if (match && match.params && match.params.subscriberOrgId && subscribers && subscribersPresences &&
        teams && integrations && this.state.subscribersLoaded && this.state.integrationsLoaded) {
      const subscriberOrgId = match.params.subscriberOrgId;
      let isOrgAdmin = false;
      if (subscribers.length > 0) {
        const subscriberByMyUser = subscribers.find(subscriber => subscriber.userId === user.userId);
        isOrgAdmin = (subscriberByMyUser.subscriberOrgs[subscriberOrgId].role === 'admin');
      }

      // if (integrations && integrations.integrationsBySubscriberOrgId[subscriberOrgId]) {
      //   let numberOfIntegrations = 0;
      //   if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box) {
      //     numberOfIntegrations += 1;
      //   }
      //   if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
      //     numberOfIntegrations += 1;
      //   }
      // }
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
            breadcrumb={
              <BreadCrumb
                subscriberOrg={subscriberOrg}
                routes={[{ title: subscriberOrg.name }]}
              />
            }
            editButton={editButton}
          />
          <CardView
            integrations={integrations}
            onSwitchView={() => this.setState({ view: 'list' })}
            subscribers={subscribers}
            subscribersPresences={subscribersPresences}
            subscriberOrgId={subscriberOrgId}
            teams={teams}
            user={user}
          />
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
