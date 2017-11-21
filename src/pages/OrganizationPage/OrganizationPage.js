import React, { Component } from 'react';
import { Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import Spinner from '../../components/Spinner';
import { IconCard } from '../../components/cards';
import UserIcon from '../../components/UserIcon/UserIcon';
import CardView from './CardView';
import ListView from './ListView';
import String from '../../translations';

const propTypes = {
  integrations: PropTypes.PropTypes.shape({
    integrationsBySubscriberOrgId: PropTypes.object
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.shape({
    currentSubscriberOrgId: PropTypes.string
  }).isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  fetchSubscribersBySubscriberOrgId: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string
    })
  }).isRequired,
  subscribers: PropTypes.array.isRequired,
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

  renderTeams() {
    const teams = this.props.teams.map(({ name, teamId }) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={teamId}>
          <Link to={`/app/team/${teamId}`}>
            <IconCard text={name} />
          </Link>
        </Col>
      );
    });

    teams.unshift(
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
        <a onClick={() => this.props.toggleTeamDialog(true)}>
          <IconCard
            icon={<i className="fa fa-plus simple-card__icons" />}
            text={String.t('OrganizationPage.addNewIntegration')}
          />
        </a>
      </Col>);


    return teams;
  }

  renderMembers() {
    return this.props.subscribers.map(({ displayName, userId }) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={userId}>
          <a>
            <IconCard text={displayName} />
          </a>
        </Col>
      );
    });
  }

  render() {
    const subscriberOrgId = this.props.match.params.subscriberOrgId;
    const { teams, integrations, subscribers, subscriberOrgs, user } = this.props;
    let isOrgAdmin = false;
    if (subscribers.length > 0) {
      const subscriberByMyUser = subscribers.find(subscriber => subscriber.userId === user.userId);
      isOrgAdmin = (subscriberByMyUser.subscriberOrgs[subscriberOrgId].role === 'admin');
    }
    if (this.state.subscribersLoaded && this.state.integrationsLoaded) {
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
        <div>
          <SubpageHeader
            icon={<UserIcon user={subscriberOrg} type="team" clickable={false} />}
            breadcrumb={subscriberOrg.name}
            editButton={editButton}
          />
          {
            this.state.view === 'list' ?
              <ListView
                integrations={integrations}
                onSwitchView={() => this.setState({ view: 'card' })}
                subscribers={subscribers}
                subscriberOrgId={subscriberOrgId}
                teams={teams}
                history={this.props.history}
              /> :
              <CardView
                integrations={integrations}
                onSwitchView={() => this.setState({ view: 'list' })}
                subscribers={subscribers}
                subscriberOrgId={subscriberOrgId}
                teams={teams}
                user={user}
              />
          }
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
