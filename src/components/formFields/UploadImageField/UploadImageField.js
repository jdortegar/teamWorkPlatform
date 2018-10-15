import React, { Component } from 'react';
import { Upload, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  allowedTypes: PropTypes.array,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  editOrg: PropTypes.bool,
  resize: PropTypes.bool
};

const defaultProps = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/vnd.microsoft.icon'],
  editOrg: false,
  resize: false
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file, allowedTypes) {
  // TODO: Get the organization's policies for uploads to determine if the upload is valid or not.
  const isFileAllowed = allowedTypes.length > 0; // allowedTypes.includes(file.type);
  if (!isFileAllowed) {
    message.error('You can only upload JPG, PNG and ICO files!');
  }
  return isFileAllowed;
}

function resizeImageBase64(img, width, height) {
  // create an off-screen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // set its dimension to target size
  canvas.width = width;
  canvas.height = height;

  // draw source image into the off-screen canvas:
  ctx.drawImage(img, 0, 0, width, height);

  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL();
}

class UploadImageField extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(imageUrl) {
    const { onChange, resize } = this.props;
    if (resize) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const side = 200.0;
        let width = side;
        let height = side;
        const aspectRatio = img.width / img.height;
        if (img.width > img.height) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }
        const imageBase64Compressed = resizeImageBase64(img, width, height);
        const base64 = imageBase64Compressed.substring(imageBase64Compressed.indexOf('base64') + 'base64,'.length);
        onChange(base64);
      };
    } else {
      // no resize
      const base64 = imageUrl.substring(imageUrl.indexOf('base64') + 'base64,'.length);
      onChange(base64);
    }
  }

  render() {
    const { allowedTypes, editOrg, image } = this.props;
    let imageToShow = null;
    if (image) {
      imageToShow = image.indexOf('www.google.com/s2/favicons') !== -1 ? image : `data:image/png;base64,${image}`;
    }

    const uploadClasses = classNames({
      'avatar-uploader': true,
      'avatar-background': !this.props.image && editOrg,
      'avatar-border': !this.props.image
    });
    const imageClass = classNames({
      UploadImageField__avatar: !editOrg,
      UploadImageField__avatar__org: editOrg
    });
    return (
      <Upload
        className={uploadClasses}
        name="avatar"
        showUploadList={false}
        beforeUpload={file => beforeUpload(file, allowedTypes)}
        customRequest={callback => {
          getBase64(callback.file, imageUrl => this.handleChange(imageUrl));
        }}
      >
        {image ? (
          <img src={imageToShow} alt={String.t('UploadImageField.alt')} className={imageClass} />
        ) : (
          <p className="avatar-uploader-trigger">{this.props.text}</p>
        )}
      </Upload>
    );
  }
}

UploadImageField.propTypes = propTypes;
UploadImageField.defaultProps = defaultProps;
export default UploadImageField;
