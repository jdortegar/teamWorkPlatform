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
      if (this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId].box) {
        let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
        if (this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId].box.expired) {
          extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
        }
        integrations.push(
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key="box">
            <a>
              <IconCard text="Box" icon={extra} />
            </a>
          </Col>
        );
      }
      if (this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId].google) {
        let extra = (<h1><i className="fa fa-check-circle icon_success" /></h1>);
        if (this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId].google.expired) {
          extra = (<h1><i className="fa fa-exclamation-triangle icon_fail" /></h1>);
        }
        integrations.push(
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }} key="google">
            <a>
              <IconCard text="Google" extra={extra} />
            </a>
          </Col>
        );
      }
    }

    return integrations;
  }

  renderTeams() {
    return this.props.teams.map(({ name, teamId }) => {
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
      let numberOfIntegrations = 0;
      if (integrations && integrations.box) {
        numberOfIntegrations += 1;
      }
      if (integrations && integrations.google) {
        numberOfIntegrations += 1;
      }
      const numberOfTeams = teams.length;
      const numberOfMembers = subscribers.length;
      const breadcrumb = subscriberOrgs.subscriberOrgById[subscriberOrgId].name;
      const renderAddCard = (text, action) => {
        return (
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
            <a onClick={action}>
              <IconCard icon={<i className="fa fa-plus simple-card__icons" />} text={text} />
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
              { this.renderTeams() }
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
