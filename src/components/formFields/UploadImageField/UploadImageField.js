import React, { Component } from 'react';
import { Upload, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';
import String from '../../../translations';

const propTypes = {
  allowedTypes: PropTypes.array,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  editOrg: PropTypes.bool.isRequired
};

const defaultProps = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/vnd.microsoft.icon']
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file, allowedTypes) {
  // TODO: Get the organization's policies for uploads to determine if the upload is valid or not.
  return false;
//   const isFileAllowed = allowedTypes.includes(file.type);
//   if (!isFileAllowed) {
//     message.error('You can only upload JPG, PNG and ICO files!');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('Image must smaller than 2 MB!');
//   }
//   return isFileAllowed && isLt2M;
}

class UploadImageField extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(imageUrl) {
    const base64 = imageUrl.substring(imageUrl.indexOf('base64') + 'base64,'.length);
    this.props.onChange(base64);
    // axios.patch(`${config.hablaApiBaseUri}/teams/updateTeam/${teamId}`, { icon: base64 }, axiosOptions);
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
        onChange={this.handleChange}
        customRequest={(callback) => {
          getBase64(callback.file, imageUrl => this.handleChange(imageUrl));
        }
        }
      >
        {
          image ?
            <img src={imageToShow} alt={String.t('UploadImageField.alt')} className={imageClass} /> :
            <p className="avatar-uploader-trigger">{this.props.text}</p>
        }
      </Upload>
    );
  }
}

UploadImageField.propTypes = propTypes;
UploadImageField.defaultProps = defaultProps;
export default UploadImageField;
