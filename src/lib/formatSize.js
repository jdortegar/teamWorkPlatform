import String from 'src/translations';

const formatSize = sizeInBytesStr => {
  const sizeInBytes = Number.parseInt(sizeInBytesStr, 10);
  if (!sizeInBytes) {
    return null;
  } else if (sizeInBytes < 1024) {
    return String.t('fileSizeInBytes', { sizeInBytes });
  } else if (sizeInBytes < 1024 * 1024) {
    return String.t('fileSizeInKBytes', { sizeInKBytes: (sizeInBytes / 1024).toFixed() });
  } else if (sizeInBytes < 10 * 1024 * 1024) {
    return String.t('fileSizeInMB', { sizeInMB: (sizeInBytes / (1024 * 1024)).toFixed(1) });
  }
  return String.t('fileSizeInMB', { sizeInMB: (sizeInBytes / (1024 * 1024)).toFixed() });
};

export default formatSize;
