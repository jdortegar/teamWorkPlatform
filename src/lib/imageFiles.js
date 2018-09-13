import {
  /* eslint-disable camelcase */
  fileType_AI,
  fileType_Audition,
  fileType_AVI,
  fileType_Bridge,
  fileType_CSS,
  fileType_CSV,
  fileType_DBF,
  fileType_DOC,
  fileType_Dreamweaver,
  fileType_DWG,
  fileType_EXE,
  fileType_File,
  fileType_Fireworks,
  fileType_FLA,
  fileType_Flash,
  fileType_HTML,
  fileType_Illustrator,
  fileType_Indesign,
  fileType_ISO,
  fileType_Javascript,
  fileType_JPG,
  fileType_JS,
  fileType_jSON,
  fileType_MP3,
  fileType_MP4,
  fileType_PDF,
  fileType_Photoshop,
  fileType_PNG,
  fileType_PPT,
  fileType_Prelude,
  fileType_Premiere,
  fileType_PSD,
  fileType_RTF,
  fileType_Search,
  fileType_SVG,
  fileType_TXT,
  fileType_XLS,
  fileType_XML,
  fileType_ZIP
} from '../img/index';

function imageSrcFromFileExtension(fileExtension) {
  if (!fileExtension) return fileType_File;

  switch (fileExtension.toUpperCase()) {
    case 'AI':
      return fileType_AI;
    case 'AUDITION':
      return fileType_Audition;
    case 'AVI':
      return fileType_AVI;
    case 'BRIDGE':
      return fileType_Bridge;
    case 'CSS':
      return fileType_CSS;
    case 'CSV':
      return fileType_CSV;
    case 'DBF':
      return fileType_DBF;
    case 'DOC':
      return fileType_DOC;
    case 'DOCX':
      return fileType_DOC;
    case 'DREAMWEAVER':
      return fileType_Dreamweaver;
    case 'DWG':
      return fileType_DWG;
    case 'EXE':
      return fileType_EXE;
    case 'FIREWORKS':
      return fileType_Fireworks;
    case 'FLA':
      return fileType_FLA;
    case 'FLASH':
      return fileType_Flash;
    case 'HTML':
      return fileType_HTML;
    case 'ILLUSTRATOR':
      return fileType_Illustrator;
    case 'INDESIGN':
      return fileType_Indesign;
    case 'ISO':
      return fileType_ISO;
    case 'JAVASCRIPT':
      return fileType_Javascript;
    case 'JPG':
      return fileType_JPG;
    case 'JS':
      return fileType_JS;
    case 'JSON':
      return fileType_jSON;
    case 'MP3':
      return fileType_MP3;
    case 'MP4':
      return fileType_MP4;
    case 'PDF':
      return fileType_PDF;
    case 'PHOTOSHOP':
      return fileType_Photoshop;
    case 'PNG':
      return fileType_PNG;
    case 'PPT':
      return fileType_PPT;
    case 'PPTX':
      return fileType_PPT;
    case 'PRELUDE':
      return fileType_Prelude;
    case 'PREMIERE':
      return fileType_Premiere;
    case 'PSD':
      return fileType_PSD;
    case 'RTF':
      return fileType_RTF;
    case 'SEARCH':
      return fileType_Search;
    case 'SVG':
      return fileType_SVG;
    case 'TXT':
      return fileType_TXT;
    case 'XLS':
      return fileType_XLS;
    case 'XLSX':
      return fileType_XLS;
    case 'XML':
      return fileType_XML;
    case 'ZIP':
      return fileType_ZIP;
    default:
      return fileType_File;
  }
}

export default imageSrcFromFileExtension;
