import React, { Component } from 'react';
import { Upload, message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getJwt } from '../../../session';
import './styles/style.css';
import config from '../../../config/env';

const propTypes = {
  allowedTypes: PropTypes.array,
  text: PropTypes.string.isRequired
}

const defaultProps = {
  allowedTypes: ['image/jpeg']
}

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

    this.state = { imageUrl: null };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(imageUrl) {
    const { teamId } = this.props;
    this.setState({ imageUrl });
    const putHeaders = {
      headers: {
        Authorization: `Bearer ${getJwt()}`,
        'Content-Type': 'image/jpeg'
      }
    };

    axios.patch(`${config.hablaApiBaseUri}/teams/updateTeam/${teamId}`, { "icon": imageUrl }, putHeaders)
    .then(data => {
      console.log(data);
    });

    // console.log('siiiiii');
    // console.log(imageUrl);
    //imageUrl es la imagen en base64
    // aqui va el axios.patch
  }

  render() {
    const { allowedTypes } = this.props;
    return (
      <Upload
        className="avatar-uploader"
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
            <img src={this.state.imageUrl} alt="Avatar" className="avatar" /> :
            <p className="avatar-uploader-trigger">{this.props.text}</p>
        }
      </Upload>
    );
  }
}

UploadImageField.propTypes = propTypes;
UploadImageField.defaultProps = defaultProps;
export default UploadImageField;
