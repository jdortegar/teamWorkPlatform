import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.PropTypes.shape({
    integrationsBySubscriberOrgId: PropTypes.object
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
  subscribers: PropTypes.shape({
    subscribersBySubscriberOrgId: PropTypes.shape({
      subscriberId: PropTypes.array
    })
  }).isRequired,
  teams: PropTypes.shape({
    teamById: PropTypes.shape({
      teamId: PropTypes.PropTypes.shape({
        name: PropTypes.string,
        teamId: PropTypes.string
      })
    }),
    teamIdsBySubscriberOrgId: PropTypes.shape({
      ids: PropTypes.array
    })
  })
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
    const subscriberOrgId = this.props.match.params.subscriberOrgId;

    if (subscriberOrgId !== this.props.subscriberOrgs.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }
    this.props.requestSubscribers(subscriberOrgId).then(() => this.setState({ subscribersLoaded: true }));
    this.props.requestIntegrations(subscriberOrgId).then(() => this.setState({ integrationsLoaded: true }));
  }

  renderIntegrations() {
    const integrations = [];
    const subscriberOrgId = this.props.match.params.subscriberOrgId;

    if (!_.isEmpty(this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId])) {
      if ('box' in this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId]) {
        integrations.push(
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
            <a>
              <IconCard text="Box" />
            </a>
          </Col>
        );
      }
      if ('google' in this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId]) {
        integrations.push(
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
            <a>
              <IconCard text="Google" />
            </a>
          </Col>
        );
      }
    }
  }

  renderTeams(subscriberOrgId) {
    const teamIds = this.props.teams.teamIdsBySubscriberOrgId[subscriberOrgId];

    return teamIds.map((teamId) => {
      const { name } = this.props.teams.teamById[teamId];
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key={teamId}>
          <Link to={`/app/team/${teamId}`}>
            <IconCard text={name} />
          </Link>
        </Col>
      );
    });
  }

  renderMembers() {
    const subscriberOrgId = this.props.match.params.subscriberOrgId;

    return this.props.subscribers.subscribersBySubscriberOrgId[subscriberOrgId].map(({ displayName, userId }) => {
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
      const numberOfTeams = teams.teamIdsBySubscriberOrgId[subscriberOrgId].length;
      const numberOfIntegrations = _.size(integrations.integrationsBySubscriberOrgId[subscriberOrgId]);
      const numberOfMembers = subscribers.subscribersBySubscriberOrgId[subscriberOrgId].length;
      const breadcrumb = subscriberOrgs.subscriberOrgById[subscriberOrgId].name;
      const renderAddCard = (text, action) => {
        return (
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
            <a onClick={action}>
              <IconCard icon={<i className="fa fa-plus simple-card__icons" aria-hidden="true" />} text={text} />
            </a>
          </Col>
        );
      };

      return (
        <div>
          <SubpageHeader breadcrumb={breadcrumb} />
          <SimpleHeader text={`Your Integrations (${numberOfIntegrations})`} />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Add a New Integration', () => this.props.history.push(`/app/integrations/${subscriberOrgId}`)) }
              { this.renderIntegrations() }
            </Row>
          </SimpleCardContainer>
          <SimpleHeader text={`Your Teams (${numberOfTeams})`} />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Add a New Team', () => this.props.toggleTeamDialog(true)) }
              { this.renderTeams(subscriberOrgId) }
            </Row>
          </SimpleCardContainer>
          <SimpleHeader text={`Your Members (${numberOfMembers})`} />
          <SimpleCardContainer className="subpage-block">
            <Row type="flex" justify="start" gutter={20}>
              { renderAddCard('Add a New Member', () => this.props.toggleInvitePeopleDialog(true)) }
              { this.renderMembers(subscriberOrgId) }
            </Row>
          </SimpleCardContainer>
        </div>
      );
    }

    return <div>Loading...</div>;
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
