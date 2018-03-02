import String from '../translations';
import { boxLogo, googleDriveLogo, sharepointLogo } from '../img';

function integrationFromResourceUri(resourceUri) {
  if (resourceUri.indexOf('google.com') > 0) return 'google';
  if (resourceUri.indexOf('box.com') > 0) return 'box';
  return null;
}

function integrationImageFromKey(key) {
  if (key === 'google') return googleDriveLogo;
  if (key === 'box') return boxLogo;
  return sharepointLogo;
}

function integrationLabelFromKey(key) {
  if (key === 'google') return 'Google Drive';
  if (key === 'box') return 'Box';
  if (key === 'sharepoint') return 'SharePoint';
  return String.t('integrationsPage.providerError');
}

function integrationImageFromResourceUri(resourceUri) {
  if (resourceUri.indexOf('google.com') > 0) {
    return googleDriveLogo;
  }
  if (resourceUri.indexOf('box.com') > 0) {
    return boxLogo;
  }
  return sharepointLogo;
}

export {
  integrationFromResourceUri,
  integrationImageFromKey,
  integrationLabelFromKey,
  integrationImageFromResourceUri
};
