import React, { Component } from 'react';
import { Col, notification } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import { IconCard } from '../../components/cards';
import CardView from './CardView';
import ListView from './ListView';
import messages from './messages';
import './styles/style.css';
import UserIcon from "../../components/UserIcon/UserIcon";

const propTypes = {
  integrations: PropTypes.PropTypes.shape({
    integrationsBySubscriberOrgId: PropTypes.object
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  toggleInvitePeopleDialog: PropTypes.func.isRequired,
  requestIntegrations: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.shape({
    currentSubscriberOrgId: PropTypes.string
  }).isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  requestSubscribers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string
    })
  }).isRequired,
  subscribers: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired
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
    const { subscriberOrgId, status } = this.props.match.params;

    if (subscriberOrgId !== this.props.subscriberOrgs.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }
    this.props.requestSubscribers(subscriberOrgId).then(() => this.setState({ subscribersLoaded: true }));
    this.props.requestIntegrations(subscriberOrgId).then(() => {
      this.setState({ integrationsLoaded: true });
      if (status) {
        notification.open({
          message: messages.success,
          description: messages[status],
          duration: 4
        });
      }
    });
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
          <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text="Add a New Integration" />
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
    const { teams, integrations, subscribers, subscriberOrgs } = this.props;
    if (this.state.subscribersLoaded && this.state.integrationsLoaded) {
      if (integrations && integrations.integrationsBySubscriberOrgId[subscriberOrgId]) {
        let numberOfIntegrations = 0;
        if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].box) {
          numberOfIntegrations += 1;
        }
        if (integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
          numberOfIntegrations += 1;
        }
      }
      const subscriberOrg = subscriberOrgs.subscriberOrgById[subscriberOrgId];
      console.log(subscriberOrg);
      return (
        <div>
          <SubpageHeader
            icon={<UserIcon user={subscriberOrg} type="team" clickable={false} />}
            breadcrumb={subscriberOrg.name}
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
              />
          }
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
