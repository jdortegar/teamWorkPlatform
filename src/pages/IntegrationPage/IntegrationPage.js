import React, { Component } from 'react';
import { Switch, Tooltip, message } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { integrationImageFromKey, integrationLabelFromKey } from 'src/utils/dataIntegrations';
import { getIntegrationStatus } from 'src/lib/integrationStatus';
import { PageHeader, SimpleCardContainer, Button, Spinner, SharingSettings, ImageCard } from 'src/components';
import './styles/style.css';

function showNotification(response, integration) {
  const { status } = response;
  const integrationLabel = integrationLabelFromKey(integration);
  if (status === 200) {
    message.success(String.t('integrationPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationPage.message.goneDescription', { name: integrationLabel }));
  } else {
    message.error(String.t('integrationPage.message.notFoundDescription'));
  }
}

const propTypes = {
  integrateOrgIntegration: PropTypes.func.isRequired,
  revokeOrgIntegration: PropTypes.func.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  fetchIntegrationContent: PropTypes.func.isRequired,
  toggleOrgSharingSettings: PropTypes.func.isRequired,
  toggleAllOrgSharingSettings: PropTypes.func.isRequired,
  saveOrgSharingSettings: PropTypes.func.isRequired,
  subscriberUserId: PropTypes.string.isRequired,
  orgId: PropTypes.string.isRequired,
  orgName: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  integration: PropTypes.object,
  content: PropTypes.object,
  contentError: PropTypes.object,
  selectedSettings: PropTypes.object,
  isFetchingContent: PropTypes.bool,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool
};

const defaultProps = {
  integration: null,
  content: null,
  contentError: null,
  selectedSettings: {},
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false
};

class IntegrationPage extends Component {
  componentDidMount() {
    const { subscriberUserId, source } = this.props;
    this.props.fetchIntegrations();
    this.props.fetchIntegrationContent(source, subscriberUserId);
  }

  componentWillReceiveProps(nextProps) {
    const { integration, contentError } = nextProps;
    if (contentError && !this.props.contentError && getIntegrationStatus(integration) === 'Active') {
      message.error(String.t('integrationPage.message.contentError'));
    }
  }

  saveSharingSettings = () => {
    const { source, subscriberUserId } = this.props;
    this.props
      .saveOrgSharingSettings(source, subscriberUserId)
      .then(() => message.success(String.t('integrationPage.message.sharingSettingsSaved')));
  };

  handleFieldChange = (key, event) => {
    this.setState({ fields: { ...this.state.fields, [key]: event.target.value } });
  };

  handleToggleSharingSettings = ({ folderId, fileId, site }) => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleOrgSharingSettings(subscriberUserId, source, { folderId, fileId, site });
  };

  handleToggleAllSharingSettings = selectAll => {
    const { subscriberUserId, source } = this.props;
    this.props.toggleAllOrgSharingSettings(subscriberUserId, source, { selectAll });
  };

  refreshIntegration = () => {
    const { source, integrateOrgIntegration, revokeOrgIntegration } = this.props;
    revokeOrgIntegration(source)
      .then(() => integrateOrgIntegration(source).catch(error => message.error(error.message)))
      .catch(error => message.error(error.message));
  };

  handleIntegration = checked => {
    const { source, integrateOrgIntegration, revokeOrgIntegration } = this.props;
    if (checked) {
      integrateOrgIntegration(source).catch(error => message.error(error.message));
    } else {
      revokeOrgIntegration(source)
        .then(res => showNotification(res, source))
        .catch(error => message.error(error.message));
    }
  };

  render() {
    const {
      orgId,
      orgName,
      source,
      integration,
      content,
      selectedSettings,
      isFetchingContent,
      isSavedSharingSettings,
      isSubmittingSharingSettings
    } = this.props;
    if (!source || !orgId) return <Spinner />;

    const integrationImageSrc = integrationImageFromKey(source);
    const integrationLabel = integrationLabelFromKey(source);
    const statusLabel = getIntegrationStatus(integration);
    const tooltipTitle =
      statusLabel === 'Active' ? String.t('integrationPage.deactivate') : String.t('integrationPage.activate');
    const displaySharingSettings = statusLabel === 'Active' && !isFetchingContent && !isEmpty(content);
    const saveButtonOptions = displaySharingSettings
      ? {
          type: 'main',
          fitText: true,
          children: 'Save Settings',
          onClick: this.saveSharingSettings,
          loading: isSubmittingSharingSettings,
          disabled: isSavedSharingSettings || isEmpty(content)
        }
      : null;

    return (
      <div className="Integration">
        <PageHeader
          backButton
          pageBreadCrumb={{
            routes: [
              {
                title: orgName,
                url: `/app/organization/${orgId}`
              },
              { title: String.t('integrationPage.integrations') }
            ]
          }}
          buttonOptions={saveButtonOptions}
        />
        <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
          <div className="Integration__icon-container">
            <ImageCard imgSrc={integrationImageSrc} size="large" />
          </div>
          <div className="habla-big-title">{integrationLabel}</div>
          <div className="habla-secondary-paragraph margin-top-class-b">{statusLabel}</div>
        </SimpleCardContainer>
        <div className="Integration__switch-container align-center-class">
          <Tooltip placement="top" title={tooltipTitle}>
            <Switch
              checkedChildren={String.t('integrationPage.on')}
              unCheckedChildren={String.t('integrationPage.off')}
              onChange={this.handleIntegration}
              checked={statusLabel === 'Active'}
            />
          </Tooltip>
        </div>
        {statusLabel === 'Active' && (
          <div className="TeamIntegration__button-container align-center-class ">
            <Button className="TeamIntegration__button" onClick={() => this.refreshIntegration()}>
              {String.t('integrationPage.refreshList')}
            </Button>
          </div>
        )}
        {isFetchingContent && statusLabel === 'Active' && (
          <div className="TeamIntegration__content-loading">
            <div>{String.t('integrationPage.contentLoading')}</div>
            <Spinner />
          </div>
        )}
        {displaySharingSettings && (
          <SharingSettings
            onToggleSelect={this.handleToggleSharingSettings}
            onToggleSelectAll={this.handleToggleAllSharingSettings}
            integrationType={integrationLabel}
            content={content}
            selectedSettings={selectedSettings}
            disabled={isSavedSharingSettings || isSubmittingSharingSettings}
          />
        )}
      </div>
    );
  }
}

IntegrationPage.propTypes = propTypes;
IntegrationPage.defaultProps = defaultProps;

export default IntegrationPage;
