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

// Example files: we can remove them after the chat API is enabled
export const docFile = 'https://www2.ed.gov/about/inits/ed/edfacts/eden/non-xml/c175-8-0.doc';
export const xlsFile =
  'https://escolaeducacao.com.br/wp-content/uploads/2015/06/planilha-controle-financeiro-domestico-idec.xls';

// TODO: when the new chat API is ready, we'll receive the correct file url and we can enable the preview feature
const CHAT_API_IMPLEMENTED = false;

// TODO: we can remove the 'pdf' check after the chat API is enabled
export const isPreviewSupported = (fileExtension = '') =>
  fileExtension === 'pdf' ||
  (CHAT_API_IMPLEMENTED &&
    (OFFICE_SUPPORTED_FORMATS.includes(fileExtension) || GOOGLE_SUPPORTED_FORMATS.includes(fileExtension)));

// TODO: we can remove the 'pdf' check after the chat API is enabled
export const getPreviewUrl = (fileUrl, fileExtension) => {
  if (fileExtension === 'pdf') return fileUrl;
  if (CHAT_API_IMPLEMENTED && OFFICE_SUPPORTED_FORMATS.includes(fileExtension)) return getOfficeViewerUrl(fileUrl);
  if (CHAT_API_IMPLEMENTED && GOOGLE_SUPPORTED_FORMATS.includes(fileExtension)) return getGoogleViewerUrl(fileUrl);
  return fileUrl;
};
