import String from 'src/translations';
import { integrationLabelFromKey } from 'src/utils/dataIntegrations';

export function successfulIntegration(integration) {
  const name = integrationLabelFromKey(integration);

  return {
    message: String.t('integrationsPage.successMessage'),
    description: String.t('integrationsPage.successDescription', { name }),
    duration: 4
  };
}

export function badIntegration({ integration, status }) {
  const name = integrationLabelFromKey(integration);

  if (status === 'FORBIDDEN') {
    return {
      message: String.t('integrationsPage.forbiddenMessage'),
      description: String.t('integrationsPage.forbiddenDescription', { name }),
      duration: 4
    };
  } else if (status === 'NOT_FOUND') {
    return {
      message: String.t('integrationsPage.notFoundMessage'),
      description: String.t('integrationsPage.notFoundDescription', { name }),
      duration: 4
    };
  }

  return {
    message: String.t('integrationsPage.unknownMessage'),
    description: String.t('integrationsPage.unknownDescription', { name }),
    duration: 4
  };
}
