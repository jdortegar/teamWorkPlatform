import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Switch, message } from 'antd';

import String from 'src/translations';
import { getIntegrationStatus } from 'src/lib/integrationStatus';
import { PageHeader, SimpleCardContainer, ImageCard } from 'src/components';
import { integrationImageFromKey, integrationLabelFromKey, integrationMapping } from 'src/utils/dataIntegrations';
import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
  integration: PropTypes.object,
  fetchTeamIntegrations: PropTypes.func.isRequired,
  integrateTeamIntegration: PropTypes.func.isRequired
};

const defaultProps = {
  integration: null
};

class TeamIntegrationPage extends Component {
  componentDidMount() {
    const { team } = this.props;
    this.props.fetchTeamIntegrations(team.teamId);
    // this.props.fetchIntegrationContent(source, subscriberUserId);
  }

  handleIntegration = checked => {
    const { source, team, integrateTeamIntegration } = this.props;
    const key = integrationMapping(source);
    if (checked) {
      integrateTeamIntegration(key, team.teamId).catch(error => message.error(error.message));
    }
  };

  render() {
    const { team, source, integration } = this.props;

    const pageBreadCrumb = {
      routes: [
        {
          title: team.name,
          url: `/app/team/${team.teamId}`
        },
        {
          title: String.t('integrationPage.integrationSettings')
        }
      ]
    };

    const integrationKey = integrationMapping(source);
    const integrationImageSrc = integrationImageFromKey(integrationKey);
    const integrationLabel = integrationLabelFromKey(integrationKey);
    const statusLabel = getIntegrationStatus(integration);
    const tooltipTitle =
      statusLabel === 'Active' ? String.t('integrationPage.deactivate') : String.t('integrationPage.activate');

    return (
      <div className="TeamIntegration">
        <PageHeader
          pageBreadCrumb={pageBreadCrumb}
          hasMenu={false}
          menuName="settings"
          backButton={`/app/teamIntegrations/${team.teamId}`}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="TeamIntegration__icon-container">
            <ImageCard imgSrc={integrationImageSrc} size="large" />
          </div>
          <div className="habla-big-title">{integrationLabel}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{statusLabel}</div>
        </SimpleCardContainer>
        <div className="TeamIntegration__switch-container align-center-class">
          <Tooltip placement="top" title={tooltipTitle}>
            <Switch
              checkedChildren={String.t('integrationPage.on')}
              unCheckedChildren={String.t('integrationPage.off')}
              onChange={this.handleIntegration}
              checked={statusLabel === 'Active'}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

TeamIntegrationPage.propTypes = propTypes;
TeamIntegrationPage.defaultProps = defaultProps;

export default TeamIntegrationPage;
