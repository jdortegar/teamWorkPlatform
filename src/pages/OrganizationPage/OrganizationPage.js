({
  babel: true
})

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
  requestIntegrations: PropTypes.func.isRequired,
  currentSubscriberOrgId: PropTypes.string,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  requestSubscribers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string
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
  },
  currentSubscriberOrgId: undefined
};

class OrganizationPage extends Component {
  componentDidMount() {
    const subscriberOrgId = this.props.match.params.subscriberOrgId;

    if (subscriberOrgId !== this.props.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }
    this.props.requestSubscribers(subscriberOrgId);
    this.props.requestIntegrations(subscriberOrgId);
    console.log(this.props.currentSubscriberOrgId);
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
          <a>
            <IconCard text={name} />
          </a>
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
    const numberOfTeams = this.props.teams.teamIdsBySubscriberOrgId[subscriberOrgId].length;
    const numberOfIntegrations = _.size(this.props.integrations.integrationsBySubscriberOrgId[subscriberOrgId]);
    const numberOfMembers = this.props.subscribers.subscribersBySubscriberOrgId[subscriberOrgId].length;
    const renderAddCard = (text, url = null) => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
          <Link to={url}>
            <IconCard icon={<i className="fa fa-plus simple-card__icons" aria-hidden="true" />} text={text} />
          </Link>
        </Col>
      );
    };

    return (
      <div>
        <SubpageHeader />
        <SimpleHeader text={`Your Integrations (${numberOfIntegrations})`} />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { renderAddCard('Add a New Integration', `/app/integrations/${subscriberOrgId}`) }
            { this.renderIntegrations() }
          </Row>
        </SimpleCardContainer>
        <SimpleHeader text={`Your Teams (${numberOfTeams})`} />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { renderAddCard('Add a New Team', `/app/integrations/${subscriberOrgId}`) }
            { this.renderTeams(subscriberOrgId) }
          </Row>
        </SimpleCardContainer>
        <SimpleHeader text={`Your Members (${numberOfMembers})`} />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { renderAddCard('Add a New Team', `/app/integrations/${subscriberOrgId}`) }
            { this.renderMembers(subscriberOrgId) }
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
