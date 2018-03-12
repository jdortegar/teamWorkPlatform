import String from '../translations';

import {
  boxLogo,
  googleDriveLogo,
  gSuiteLogo,
  sharepointLogo,
  oneDriveLogo,
  office365Logo,
  salesforceLogo,
  dropboxLogo,
  jiraLogo,
  slackLogo,
  trelloLogo,
  gitHubLogo,
  ibmConnectionsLogo
} from '../img';

const possibleIntegrations = {
  box: {
    label: 'Box', // TODO: localize??
    logo: boxLogo,
    isSupported: true
  },
  google: {
    label: 'Google Drive', // TODO: localize??
    logo: googleDriveLogo,
    isSupported: true
  },
  gsuite: {
    key: 'google', // *** maps to the Google Drive integration ***
    label: 'G Suite by Google Cloud', // TODO: localize??
    logo: gSuiteLogo,
    isSupported: true,
    mappedToKey: 'google'
  },
  sharepoint: {
    key: 'sharepoint',
    label: 'SharePoint', // TODO: localize??
    logo: sharepointLogo,
    isSupported: true,
    config: {
      params: [{
        key: 'sharepointOrg', // used to set value and to returned it via integrations.sharepoint.sharepointOrg
        type: 'edit',
        label: 'Site ID:', // TODO: localize
        value: 'site',
        placeholder: 'Enter Sharepoint Site ID' // TODO: localize
      }],
      folders: {
        label: 'Sites:', // TODO: localize
        key: 'sites', // integrations.sharepoint.sites (type is an array)
        folderKeys: {
          selected: 'selected', // integrations.sharepoint.sites[index].selected (type is boolean)
          folderKey: 'site', // integrations.sharepoint.sites[index].site (type is string)
          subFolders: 'sites' // site.sites (type is an array)
        }
      }
    }
  },
  oneDrive: {
    key: 'onedrive',
    label: 'OneDrive',
    logo: oneDriveLogo,
    isSupported: true
  },
  office365: {
    key: 'onedrive', // *** maps to the oneDrive integration ***
    label: 'Office365',
    logo: office365Logo,
    mappedToKey: 'onedrive',
    isSupported: true
  },
  salesforce: {
    key: 'salesforce',
    label: 'Salesforce',
    logo: salesforceLogo
  },
  dropBox: {
    key: 'dropbox',
    label: 'Dropbox',
    logo: dropboxLogo
  },
  jira: {
    key: 'jira',
    label: 'Jira',
    logo: jiraLogo
  },
  slack: {
    key: 'slack',
    label: 'Slack',
    logo: slackLogo
  },
  trello: {
    key: 'trello',
    label: 'Trello',
    logo: trelloLogo
  },
  github: {
    key: 'github',
    label: 'Github',
    logo: gitHubLogo
  },
  ibmconn: {
    key: 'ibmconn',
    label: 'IBM Connections Cloud',
    logo: ibmConnectionsLogo
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

function integrationLabelFromKey(key) {
  if (!possibleIntegrations[key]) return String.t('integrationsPage.providerError');
  return possibleIntegrations[key].label;
}

function integrationIsSupported(key) {
  return possibleIntegrations[key].isSupported;
}

function integrationMapping(key) {
  return possibleIntegrations[key].mappedToKey || key;
}

function integrationConfigFromKey(key) {
  return possibleIntegrations[key].config;
}

export {
  availableIntegrationKeys,
  integrationKeyFromFile,
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationIsSupported,
  integrationMapping,
  integrationConfigFromKey
};
