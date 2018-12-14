import String from 'src/translations';

import {
  boxLogo,
  googleDriveLogo,
  googleDriveExtraLogo,
  oneDriveLogo,
  oneDriveExtraLogo,
  salesforceLogo,
  dropboxLogo,
  jiraLogo,
  slackLogo,
  trelloLogo,
  gitHubLogo,
  ibmConnectionsLogo,
  adobeLogo
} from 'src/img';

const possibleIntegrations = {
  box: {
    label: 'Box',
    logo: boxLogo,
    isSupported: true
  },
  google: {
    label: 'Google Drive',
    logo: googleDriveLogo,
    extraLogo: googleDriveExtraLogo,
    isSupported: true,
    extraInfo: String.t('integrationPage.extraInfo.google')
  },
  onedrive: {
    label: 'OneDrive',
    logo: oneDriveLogo,
    extraLogo: oneDriveExtraLogo,
    isSupported: true,
    extraInfo: String.t('integrationPage.extraInfo.onedrive')
  },
  salesforce: {
    label: 'Salesforce',
    logo: salesforceLogo,
    isSupported: true
  },
  dropbox: {
    label: 'Dropbox',
    logo: dropboxLogo,
    isSupported: true
  },
  jira: {
    label: 'Jira',
    logo: jiraLogo
  },
  slack: {
    label: 'Slack',
    logo: slackLogo
  },
  trello: {
    label: 'Trello',
    logo: trelloLogo
  },
  github: {
    label: 'Github',
    logo: gitHubLogo
  },
  ibmconn: {
    label: 'IBM Connections Cloud',
    logo: ibmConnectionsLogo
  },
  adobecloud: {
    label: 'Adobe Creative Cloud',
    logo: adobeLogo
  }
};

function availableIntegrationKeys() {
  return Object.keys(possibleIntegrations);
}

function integrationKeyFromFile(file) {
  return file.fileSource;
}

function integrationImageFromKey(key) {
  if (!possibleIntegrations[key]) return null;
  return possibleIntegrations[key].logo;
}

function integrationExtraImageFromKey(key) {
  if (!possibleIntegrations[key]) return null;
  return possibleIntegrations[key].extraLogo || integrationImageFromKey(key);
}

function integrationLabelFromKey(key) {
  if (!possibleIntegrations[key]) return String.t('integrationsPage.providerError');
  return possibleIntegrations[key].label;
}

function integrationExtraInfoFromKey(key) {
  return possibleIntegrations[key].extraInfo;
}

function integrationIsSupported(key) {
  return possibleIntegrations[key].isSupported;
}

export {
  availableIntegrationKeys,
  integrationKeyFromFile,
  integrationImageFromKey,
  integrationExtraImageFromKey,
  integrationLabelFromKey,
  integrationExtraInfoFromKey,
  integrationIsSupported
};
