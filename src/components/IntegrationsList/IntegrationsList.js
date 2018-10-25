import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';

import { availableIntegrationKeys, integrationMapping } from 'src/utils/dataIntegrations';
import { SimpleCardContainer } from 'src/components';
import IntegrationCard from './IntegrationCard';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.array,
  orgId: PropTypes.string.isRequired,
  teamId: PropTypes.string
};

const defaultProps = {
  integrations: [],
  teamId: null
};

class IntegrationsList extends Component {
  renderIntegration = (key, integration) => {
    const { orgId, teamId } = this.props;
    const url = teamId ? `/app/teamIntegrations/${teamId}/${key}` : `/app/integrations/${orgId}/${key}`;
    return <IntegrationCard key={key} source={key} integration={integration} url={url} />;
  };

  renderIntegrations = () => {
    const { integrations } = this.props;
    const findIntegration = key => integrations.find(item => item.key === integrationMapping(key));
    return availableIntegrationKeys().map(key => this.renderIntegration(key, findIntegration(key)));
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
