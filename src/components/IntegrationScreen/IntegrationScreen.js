import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Tooltip } from 'antd';
import { isEmpty } from 'lodash';

import String from 'src/translations';
import { getIntegrationStatus } from 'src/lib/integrations';
import {
  integrationExtraImageFromKey,
  integrationLabelFromKey,
  integrationExtraInfoFromKey
} from 'src/utils/dataIntegrations';
import { PageHeader, SimpleCardContainer, Button, Spinner, SharingSettings, ImageCard } from 'src/components';
import './styles/style.css';

const propTypes = {
  onSaveSettings: PropTypes.func.isRequired,
  onSwitchIntegration: PropTypes.func.isRequired,
  onRefreshIntegration: PropTypes.func.isRequired,
  onToggleSettings: PropTypes.func.isRequired,
  onToggleAllSettings: PropTypes.func.isRequired,
  source: PropTypes.string.isRequired,
  team: PropTypes.object,
  orgId: PropTypes.string,
  orgName: PropTypes.string,
  userEmail: PropTypes.string,
  integration: PropTypes.object,
  content: PropTypes.object,
  selectedSettings: PropTypes.object,
  isFetchingContent: PropTypes.bool,
  isSubmittingSharingSettings: PropTypes.bool,
  isSavedSharingSettings: PropTypes.bool,
  isUpdating: PropTypes.bool
};

const defaultProps = {
  team: null,
  orgId: null,
  orgName: '',
  userEmail: '',
  integration: null,
  content: null,
  selectedSettings: {},
  isFetchingContent: false,
  isSubmittingSharingSettings: false,
  isSavedSharingSettings: false,
  isUpdating: false
};

const IntegrationScreen = ({
  source,
  integration,
  content,
  onSaveSettings,
  selectedSettings,
  isFetchingContent,
  isSavedSharingSettings,
  isSubmittingSharingSettings,
  onSwitchIntegration,
  onRefreshIntegration,
  onToggleSettings,
  onToggleAllSettings,
  team,
  orgId,
  orgName,
  userEmail,
  isUpdating
}) => {
  if (!source || (!orgId && !team)) return <Spinner />;

  const extraInfo = integrationExtraInfoFromKey(source);
  const statusLabel = getIntegrationStatus(integration);
  const isActive = statusLabel === 'Active';
  const emailLabel = isActive ? userEmail : String.t('integrationPage.status.revoked');
  const tooltipTitle = isActive ? String.t('integrationPage.deactivate') : String.t('integrationPage.activate');
  const sharingSettingsVisible = isActive && !isFetchingContent && !isEmpty(content);
  const saveButtonOptions = sharingSettingsVisible
    ? {
        type: 'main',
        fitText: true,
        children: 'Save Settings',
        onClick: onSaveSettings,
        loading: isSubmittingSharingSettings,
        disabled: isSavedSharingSettings || isEmpty(content)
      }
    : null;
  const breadCrumbRoute = {
    title: team ? team.name : orgName,
    link: team ? `/app/team/${team.teamId}` : `/app/organization/${orgId}`
  };

  return (
    <div className="Integration">
      <PageHeader
        backButton
        buttonOptions={saveButtonOptions}
        pageBreadCrumb={{
          routes: [breadCrumbRoute, { title: String.t('integrationPage.integrations') }]
        }}
        optionalButtons={{
          enabled: true,
          content: isActive ? (
            <Button
              type="main"
              fitText
              className="Integration__button-refresh"
              onClick={onRefreshIntegration}
              loading={isUpdating}
            >
              {String.t('integrationPage.refreshList')}
            </Button>
          ) : null
        }}
      />
      <SimpleCardContainer className="subpage-block habla-color-lightergrey padding-class-b border-bottom-light align-center-class">
        <div className="Integration__icon-container">
          <ImageCard imgSrc={integrationExtraImageFromKey(source)} size="large" />
        </div>
        <div className="habla-big-title">{integrationLabelFromKey(source)}</div>
        <div className="habla-secondary-paragraph margin-top-class-b">{team ? emailLabel : statusLabel}</div>
      </SimpleCardContainer>
      {extraInfo && <div className="Integration__extraInfo">{extraInfo}</div>}
      <div className="Integration__switch-container align-center-class">
        <Tooltip placement="top" title={tooltipTitle}>
          <Switch
            checkedChildren={String.t('integrationPage.on')}
            unCheckedChildren={String.t('integrationPage.off')}
            onChange={onSwitchIntegration}
            checked={isActive}
          />
        </Tooltip>
      </div>
      {isFetchingContent && isActive && (
        <div className="Integration__content-loading">
          <div>{String.t('integrationPage.contentLoading')}</div>
          <Spinner />
        </div>
      )}
      {sharingSettingsVisible && (
        <SharingSettings
          onToggleSelect={onToggleSettings}
          onToggleSelectAll={onToggleAllSettings}
          content={content}
          selectedSettings={selectedSettings}
          disabled={isSavedSharingSettings || isSubmittingSharingSettings}
        />
      )}
      {sharingSettingsVisible && (
        <div className="padding-class-a align-right-class">
          <Button className="rightSideButton" {...saveButtonOptions} />
        </div>
      )}
    </div>
  );
};

IntegrationScreen.propTypes = propTypes;
IntegrationScreen.defaultProps = defaultProps;

export default IntegrationScreen;
