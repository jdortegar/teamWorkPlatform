import String from '../translations';
import { boxLogo, googleDriveLogo, sharepointLogo, oneDriveLogo, salesforceLogo } from '../img';

const possibleIntegrations = {
  box: {
    label: 'Box',
    logo: boxLogo,
    uniqueUrl: 'box.com',
    link: 'https://app.box.com/apps'
  },
  google: {
    label: 'Google Drive',
    logo: googleDriveLogo,
    uniqueUrl: 'google.com',
    link: 'https://drive.google.com/drive/u/0/my-drive'
  },
  sharepoint: {
    label: 'SharePoint',
    logo: sharepointLogo,
    uniqueUrl: 'sharepoint.com', // TODO: test this out
    link: 'https://sharepoint.com'
  },
  oneDrive: {
    label: 'OneDrive',
    logo: oneDriveLogo,
    uniqueUrl: 'onedrive.com', // TODO: test this out
    link: null
  },
  salesforce: {
    label: 'Salesforce',
    logo: salesforceLogo,
    uniqueUrl: 'salesforce.com', // TODO: test this out
    link: null
  }
};

function availableIntegrations() {
  return possibleIntegrations;
}

function integrationFromResourceUri(resourceUri) {
  const match = Object.keys(possibleIntegrations).filter(key => resourceUri.indexOf(possibleIntegrations[key].uniqueUrl) > 0);
  return (match && match.length) ? possibleIntegrations[match[0]] : null;
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
  const key = integrationFromResourceUri(resourceUri);
  return key ? possibleIntegrations[key].logo : null;
}

export {
  availableIntegrations,
  integrationFromResourceUri,
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationImageFromResourceUri
};
