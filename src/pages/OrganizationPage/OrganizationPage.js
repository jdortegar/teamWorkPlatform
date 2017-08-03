import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleHeader from '../../components/SimpleHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.array,
  requestIntegrations: PropTypes.func.isRequired,
  currentSubscriberOrgId: PropTypes.string.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
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
  integrations: [1, 2, 3, 4, 5, 6, 7, 8],
  teams: {
    teamIdsBySubscriberOrgId: {
      ids: []
    }
  }
};

class OrganizationPage extends Component {
  componentDidMount() {
    const subscriberOrgId = this.props.match.params.subscriberOrgId;

    this.props.requestIntegrations(subscriberOrgId);
    if(subscriberOrgId !== this.props.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }
  }

  renderAddCard(text, url) {
    return (
      <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
        <Link to={url}>
          <IconCard icon={<i className="fa fa-plus simple-card__icons" aria-hidden="true" />} text={text} />
        </Link>
      </Col>
    );
  }

  renderIntegrations() {
    return this.props.integrations.map(() => {
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
          <a>
            <IconCard text="Name" />
          </a>
        </Col>
      );
    });
  }

  renderTeams(subscriberOrgId) {
    const teamIds = this.props.teams.teamIdsBySubscriberOrgId[subscriberOrgId];

    return teamIds.map((teamId) => {
      const { name } = this.props.teams.teamById[teamId];
      return (
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 4 }}>
          <a>
            <IconCard text={name} />
          </a>
        </Col>
      );
    });
  }

  render() {
    const subscriberOrgId = this.props.match.params.subscriberOrgId;

    return (
      <div>
        <SubpageHeader />
        <SimpleHeader text="Your Integrations (2)" />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { this.renderAddCard('Add a New Integration', `/app/integrations/${subscriberOrgId}`) }
            { this.renderIntegrations() }
          </Row>
        </SimpleCardContainer>
        <SimpleHeader text="Your Teams" />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="start" gutter={20}>
            { this.renderAddCard('Add a New Team', `/app/integrations/${subscriberOrgId}`) }
            { this.renderTeams(subscriberOrgId) }
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
