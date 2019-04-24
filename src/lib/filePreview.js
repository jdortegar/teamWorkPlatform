// Source https://gist.github.com/tzmartin/1cf85dc3d975f94cfddc04bc0dd399be

const getGoogleViewerUrl = fileUrl => `https://docs.google.com/viewer?url=${fileUrl}&embedded=true`;
const getOfficeViewerUrl = fileUrl => `http://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`;

const OFFICE_SUPPORTED_FORMATS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
const GOOGLE_SUPPORTED_FORMATS = [
  'jpeg',
  'png',
  'gif',
  'tiff',
  'bmp',
  'pdf',
  'mpeg4',
  '3gpp',
  'mov',
  'avi',
  'mpegps',
  'wmv',
  'flv',
  'txt',
  'css',
  'html',
  'php',
  'c',
  'cpp',
  'h',
  'hpp',
  'js',
  'ai',
  'psd',
  'svg',
  'zip',
  'rar'
];
export const isPreviewSupported = (fileExtension = '') =>
  OFFICE_SUPPORTED_FORMATS.includes(fileExtension) || GOOGLE_SUPPORTED_FORMATS.includes(fileExtension);

export const getPreviewUrl = (fileUrl, fileExtension) => {
  if (OFFICE_SUPPORTED_FORMATS.includes(fileExtension)) return getOfficeViewerUrl(fileUrl);
  if (GOOGLE_SUPPORTED_FORMATS.includes(fileExtension)) return getGoogleViewerUrl(fileUrl);
  return fileUrl;
};
