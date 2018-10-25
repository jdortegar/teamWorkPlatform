import String from 'src/translations';

// eslint-disable-next-line import/prefer-default-export
export const getIntegrationStatus = integration => {
  if (!integration) return '';
  if (integration.expired) {
    return String.t('integrationPage.status.expired');
  } else if (integration.revoked) {
    return String.t('integrationPage.status.revoked');
  }
  return String.t('integrationPage.status.active');
};
