import React, { Component } from 'react';
import { Row, Col, Switch, Tooltip } from 'antd';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { IconCard } from '../../components/cards';
import messages from './messages';
import './styles/style.css';

class IntegrationDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.state = { view: 'card' };

    this.handleIntegration = this.handleIntegration.bind(this);
  }

  handleIntegration(checked) {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    if (checked) {
      if (integrationDetails === 'google') {
        this.props.integrateGoogle(subscriberOrgId);
      } else if (integrationDetails === 'box') {
        this.props.integrateBox(subscriberOrgId);
      }
    }
  }

  render() {
    const { integrationDetails, subscriberOrgId } = this.props.match.params;
    const subscriberOrgName = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId].name;

    return (
      <div>
        <SubpageHeader breadcrumb={<div><span className="breadcrumb_underline">{subscriberOrgName}</span> / {messages.integrations}</div>} />
        <SimpleCardContainer className="subpage-block">
          <Row type="flex" justify="center">
            <Col xs={{ span: 24 }} sm={{ span: 8 }} md={{ span: 4 }}>
              <div className="Integration-details__icon-container">
                <IconCard text={messages[integrationDetails]} size="large" />
                <div>
                  <Tooltip placement="top" title={messages.activate}>
                    <Switch checkedChildren={messages.on} unCheckedChildren={messages.off} onChange={this.handleIntegration} />
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 19 }}>
              <div className="team-member-page__member-info">
                <h1>{messages[integrationDetails]}</h1>
              </div>
            </Col>
          </Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

export default IntegrationDetailsPage;
