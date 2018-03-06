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
    key: 'box',
    label: 'Box', // TODO: localize??
    logo: boxLogo,
    uniqueUrl: 'box.com',
    link: 'https://app.box.com/apps'
  },
  google: {
    key: 'google',
    label: 'Google Drive', // TODO: localize??
    logo: googleDriveLogo,
    uniqueUrl: 'google.com',
    link: 'https://drive.google.com/drive/u/0/my-drive'
  },
  gsuite: {
    key: 'google', // *** maps to the Google Drive integration ***
    label: 'G Suite by Google Cloud', // TODO: localize??
    logo: gSuiteLogo,
    uniqueUrl: 'google.com',
    link: 'https://drive.google.com/drive/u/0/my-drive'
  },
  sharepoint: {
    key: 'sharepoint',
    label: 'SharePoint', // TODO: localize??
    logo: sharepointLogo,
    uniqueUrl: 'sharepoint.com', // TODO: test this out
    link: 'https://sharepoint.com',
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
    uniqueUrl: 'onedrive.com', // TODO: test this out
    link: null
  },
  office365: {
    key: 'onedrive', // *** maps to the oneDrive integration ***
    label: 'Office365',
    logo: office365Logo,
    uniqueUrl: 'onedrive.com', // TODO: test this out
    link: null
  },
  salesforce: {
    key: 'salesforce',
    label: 'Salesforce',
    logo: salesforceLogo,
    uniqueUrl: 'salesforce.com', // TODO: test this out
    link: null
  },
  dropBox: {
    key: 'dropbox',
    label: 'Dropbox',
    logo: dropboxLogo,
    uniqueUrl: 'dropbox.com',
    link: null
  },
  jira: {
    key: 'jira',
    label: 'Jira',
    logo: jiraLogo,
    uniqueUrl: 'jira.com',
    link: null
  },
  slack: {
    key: 'slack',
    label: 'Slack',
    logo: slackLogo,
    uniqueUrl: 'slack.com',
    link: null
  },
  trello: {
    key: 'trello',
    label: 'Trello',
    logo: trelloLogo,
    uniqueUrl: 'trello.com',
    link: null
  },
  github: {
    key: 'github',
    label: 'Github',
    logo: gitHubLogo,
    uniqueUrl: 'github.com',
    link: null
  },
  ibmconn: {
    key: 'ibmconn',
    label: 'IBM Connections Cloud',
    logo: ibmConnectionsLogo,
    uniqueUrl: 'ibm.com',
    link: null
  }
};

function availableIntegrations() {
  return possibleIntegrations;
}

function integrationKeyFromFile(file) {
  const { fileSource, resourceUri } = file;
  if (fileSource) return fileSource;
  if (!resourceUri) return null;
  const match = Object.keys(possibleIntegrations).filter(key => resourceUri.indexOf(possibleIntegrations[key].uniqueUrl) > 0);
  return (match && match.length) ? possibleIntegrations[match[0]].key : null;
}

function integrationImageFromKey(key) {
  if (!possibleIntegrations[key]) return null;
  return possibleIntegrations[key].logo;
}

function integrationLabelFromKey(key) {
  if (!possibleIntegrations[key]) return String.t('integrationsPage.providerError');
  return possibleIntegrations[key].label;
}

function integrationLinkFromKey(key) {
  return possibleIntegrations[key].link;
}

export {
  availableIntegrations,
  integrationKeyFromFile,
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationLinkFromKey
};
