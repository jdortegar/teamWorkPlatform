import String from 'src/translations';
import { integrationKeyFromFile } from 'src/utils/dataIntegrations';

export const getOwnersFromFiles = files => {
  const owners = files.reduce((acc, file) => {
    const key = file.fileOwnerId;
    acc[key] = { key, count: (acc[key] ? acc[key].count : 0) + 1 };
    return acc;
  }, {});

  return Object.values(owners).sort((a, b) => b.count - a.count);
};

export const getFileTypesFromFiles = files => {
  const fileTypes = files.reduce((acc, file) => {
    const { fileType, fileExtension } = file;
    const key = fileExtension || String.t('ckgPage.filterTypeOther');
    acc[key] = {
      key,
      label: fileType || key,
      fileExtension,
      count: (acc[key] ? acc[key].count : 0) + 1
    };
    return acc;
  }, {});

  return Object.values(fileTypes).sort((a, b) => b.count - a.count);
};

export const getIntegrationsFromFiles = files => {
  const integrations = files.reduce((acc, file) => {
    const key = integrationKeyFromFile(file);
    acc[key] = { key, count: (acc[key] ? acc[key].count : 0) + 1 };
    return acc;
  }, {});

  return Object.values(integrations).sort((a, b) => b.count - a.count);
};
