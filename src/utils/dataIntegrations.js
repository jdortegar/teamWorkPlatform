import String from '../translations';
import { boxLogo, googleDriveLogo, sharepointLogo, oneDriveLogo, salesforceLogo } from '../img';

const possibleIntegrations = {
  box: {
    key: 'box',
    label: 'Box',
    logo: boxLogo,
    uniqueUrl: 'box.com',
    link: 'https://app.box.com/apps'
  },
  google: {
    key: 'google',
    label: 'Google Drive',
    logo: googleDriveLogo,
    uniqueUrl: 'google.com',
    link: 'https://drive.google.com/drive/u/0/my-drive'
  },
  sharepoint: {
    key: 'sharepoint',
    label: 'SharePoint',
    logo: sharepointLogo,
    uniqueUrl: 'sharepoint.com', // TODO: test this out
    link: 'https://sharepoint.com',
    config: {
      params: [{
        key: 'sharepointOrg',
        label: 'Site ID',
        placeholder: 'Enter Sharepoint Site ID'
      }]
    }
  },
  oneDrive: {
    key: 'onedrive',
    label: 'OneDrive',
    logo: oneDriveLogo,
    uniqueUrl: 'onedrive.com', // TODO: test this out
    link: null
  },
  salesforce: {
    key: 'salesforce',
    label: 'Salesforce',
    logo: salesforceLogo,
    uniqueUrl: 'salesforce.com', // TODO: test this out
    link: null
  }
};

function availableIntegrations() {
  return possibleIntegrations;
}

function integrationKeyFromResourceUri(resourceUri) {
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

function integrationImageFromResourceUri(resourceUri) {
  const key = integrationKeyFromResourceUri(resourceUri);
  return key ? possibleIntegrations[key].logo : null;
}

function integrationLinkFromKey(key) {
  return possibleIntegrations[key].link;
}

export {
  availableIntegrations,
  integrationKeyFromResourceUri,
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationImageFromResourceUri,
  integrationLinkFromKey
};
