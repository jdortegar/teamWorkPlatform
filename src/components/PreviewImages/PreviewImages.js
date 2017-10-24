import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { getJwt } from '../../session';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  images: PropTypes.array
};

const defaultProps = {
  images: []
};

class PreviewImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      isImage: true,
      previewImage: '',
      images: []
    };

    this.handlePreview = this.handlePreview.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const { images } = this.props;
    const putHeaders = {
      headers: {
        Authorization: `Bearer ${getJwt()}`
      }
    };
    const imagesBase64 = [];
    images.forEach((image) => {
      const { resourceId } = image;
      axios.get(`https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource/${resourceId}`, putHeaders)
        .then((resource) => {
          const imageBase64 = resource.data.split('base64')[1];
          const imageSrc = `data:${resource.headers['content-type']};base64,${imageBase64}`;
          imagesBase64.push({
            src: imageSrc,
            contentType: resource.headers['content-type'],
            fileName: resource.headers['x-hablaai-filename']
          });
          this.setState({
            images: imagesBase64
          });
        });
    });
  }

  handleCancel() {
    this.setState({
      previewVisible: false
    });
  }

  handlePreview(file, isImage, extension) {
    const previewVisible = isImage || (extension === 'pdf');
    this.setState({
      isImage: isImage,
      previewVisible: previewVisible,
      previewImage: file
    });
  }

  renderFiles(files) {
    return files.map((file, index) => {
      const fileType = file.contentType.split('/')[0];
      const isImage = fileType === 'image';
      const [name, extension] = file.fileName.split('.');
      if (isImage) {
        return <div className="image-wrapper" key={index}>
          <img src={file.src} alt="" onClick={() => this.handlePreview(file.src, isImage, extension)} />
        </div>;
      }

      if (extension === 'pdf') {
        return <div className="image-wrapper preview__file-wrapper" key={index} onClick={() => this.handlePreview(file.src, isImage, extension)}>
          <div className="file-wrapper__extension">
            <i className="fa fa-file file-icon" aria-hidden="true">
            </i>
            <span className="file-wrapper__file-type">{extension}</span>
          </div>
          <span className="file-name">{decodeURI(name)}</span>
        </div>
      }

      return <a href={file.src} download>
        <div className="image-wrapper preview__file-wrapper" onClick={() => this.handlePreview(file.src, isImage, extension)}>
          <div className="file-wrapper__extension">
            <i className="fa fa-file file-icon" aria-hidden="true">
            </i>
            <span className="file-wrapper__file-type">{extension}</span>
          </div>
          <span className="file-name"><a href={file.src} download>{decodeURI(name)}</a></span>
        </div>
      </a>
    });
  }

  render() {
    const { images, previewVisible, previewImage, isImage } = this.state;
    const isFile = classNames({
      'is-file': !isImage
    });
    return (
      <div className="preview-images">
        {this.renderFiles(images)}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={isFile}>
          { isImage ?
            <img className="PreviewImages__modal-img" alt="" src={previewImage} />
            :
            <iframe src={previewImage} width="970" height="600" />
          }
        </Modal>
      </div>
    );
  }
}

PreviewImages.propTypes = propTypes;
PreviewImages.defaultProps = defaultProps;

export default PreviewImages;

