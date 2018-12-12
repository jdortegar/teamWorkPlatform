import { message } from 'antd';

import String from 'src/translations';
import { integrationLabelFromKey } from 'src/utils/dataIntegrations';

export const getIntegrationStatus = integration => {
  if (!integration) return '';
  if (integration.expired) {
    return String.t('integrationPage.status.expired');
  } else if (integration.revoked) {
    return String.t('integrationPage.status.revoked');
  }
  return String.t('integrationPage.status.active');
};

export const displayRevokeMessage = (status, source) => {
  const integrationLabel = integrationLabelFromKey(source);
  if (status === 200) {
    message.success(String.t('integrationPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationPage.message.goneDescription', { name: integrationLabel }));
  } else {
    message.error(String.t('integrationPage.message.notFoundDescription'));
  }
};
