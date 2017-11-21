import String from '../../translations';

function providerName(integration) {
  if (integration === 'google') {
    return 'Google Drive';
  } else if (integration === 'box') {
    return 'Box';
  }

  return String.t('integrationsPage.providerError');
}

export function successfulIntegration(integration) {
  const name = providerName(integration);

  return {
    message: String.t('integrationsPage.successMessage'),
    description: String.t('integrationsPage.successDescription', { name }),
    duration: 4
  };
}

export function badIntegration({ integration, status }) {
  const name = providerName(integration);

  if (status === 'FORBIDDEN') {
    return {
      message: String.t('integrationsPage.forbiddenMessage'),
      description: String.t('integrationsPage.forbiddenDescription', { name }),
      duration: 4
    };
  } else if (status === 'NOT_FOUND') {
    return {
      message: String.t('integrationsPage.notFoundMessage'),
      description: String.t('integrationsPage.notFoundDescription'),
      duration: 4
    };
  }

  return {
    message: String.t('integrationsPage.unknownMessage'),
    description: String.t('integrationsPage.unknownDescription', { name }),
    duration: 4
  };
}
