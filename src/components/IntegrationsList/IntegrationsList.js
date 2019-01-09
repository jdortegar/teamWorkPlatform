import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';

import { availableIntegrationKeys, integrationIsSupported } from 'src/utils/dataIntegrations';
import { SimpleCardContainer } from 'src/components';
import IntegrationCard from './IntegrationCard';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.array,
  orgId: PropTypes.string,
  teamId: PropTypes.string,
  hideInactive: PropTypes.bool,
  onIntegrationClick: PropTypes.func
};

const defaultProps = {
  integrations: [],
  teamId: null,
  orgId: null,
  hideInactive: false,
  onIntegrationClick: () => {}
};

class IntegrationsList extends Component {
  renderIntegration = (source, integration) => {
    const { orgId, teamId, onIntegrationClick } = this.props;
    const url = teamId ? `/app/teamIntegrations/${teamId}/${source}` : `/app/integrations/${orgId}/${source}`;
    return (
      <IntegrationCard key={source} source={source} integration={integration} url={url} onClick={onIntegrationClick} />
    );
  };

  renderIntegrations = () => {
    const { integrations, hideInactive } = this.props;
    const findIntegration = key => integrations.find(item => item.source === key);
    const availableKeys = availableIntegrationKeys().filter(key => !hideInactive || integrationIsSupported(key));
    return availableKeys.map(key => this.renderIntegration(key, findIntegration(key)));
  };

  render() {
    return (
      <div className="IntegrationsList padding-class-a">
        <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex margin-top-class-b">
          <Row type="flex">{this.renderIntegrations()}</Row>
        </SimpleCardContainer>
      </div>
    );
  }
}

IntegrationsList.propTypes = propTypes;
IntegrationsList.defaultProps = defaultProps;

export default IntegrationsList;
