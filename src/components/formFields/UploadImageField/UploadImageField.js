import React, { Component } from 'react';
import { Upload, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  allowedTypes: PropTypes.array,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  editOrg: PropTypes.bool.isRequired
};

const defaultProps = {
  allowedTypes: ['image/jpeg']
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file, allowedTypes) {
  const isFileAllowed = allowedTypes.includes(file.type);
  if (!isFileAllowed) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isFileAllowed && isLt2M;
}

class UploadImageField extends Component {
  constructor(props) {
    super(props);

    this.state = { imageUrl: this.props.image };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(imageUrl) {
    const base64 = imageUrl.substring(imageUrl.indexOf('base64') + 'base64,'.length);
    this.setState({ imageUrl: base64 });
    this.props.onChange(base64);
    // axios.patch(`${config.hablaApiBaseUri}/teams/updateTeam/${teamId}`, { icon: base64 }, axiosOptions);
  }

  render() {
    const { allowedTypes, editOrg } = this.props;
    const uploadClasses = classNames({
      'avatar-uploader': true,
      'avatar-background': !this.state.imageUrl && editOrg,
      'avatar-border': !this.state.imageUrl
    });
    const imageClass = classNames({
      UploadImageField__avatar: !editOrg,
      UploadImageField__avatar__org: editOrg
    });
    return (
      <Upload
        class={uploadClasses}
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
          this.state.imageUrl ?
            <img src={`data:image/png;base64,${this.state.imageUrl}`} alt="Set Avatar" className={imageClass} /> :
            <p className="avatar-uploader-trigger">{this.props.text}</p>
        }
      </Upload>
    );
  }
}

UploadImageField.propTypes = propTypes;
UploadImageField.defaultProps = defaultProps;
export default UploadImageField;
