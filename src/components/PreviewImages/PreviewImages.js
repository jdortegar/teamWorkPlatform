import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { getJwt } from '../../session';
import './styles/style.css';

const propTypes = {
  images: PropTypes.array,
  subscriberOrgId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  teamRoomId: PropTypes.string.isRequired,
  onLoadImage: PropTypes.func
};

const defaultProps = {
  images: [],
  onLoadImage: null
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
        Authorization: `Bearer ${getJwt()}`,
        'x-hablaai-teamroomid': this.props.teamRoomId,
        'x-hablaai-teamid': this.props.teamId,
        'x-hablaai-subscriberorgid': this.props.subscriberOrgId
      }
    };
    const imagesBase64 = [];
    images.forEach((image) => {
      const { resourceId } = image;
      axios.get(`https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource/${resourceId}`, putHeaders)
        .then((resource) => {
          const imageSrc = `data:${resource.headers['x-hablaai-content-type']};base64,${resource.data}`;
          imagesBase64.push({
            src: imageSrc,
            contentType: resource.headers['x-hablaai-content-type'],
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
      isImage,
      previewVisible,
      previewImage: file
    });
  }

  renderFiles(files) {
    return files.map((file, index) => {
      const fileType = file.contentType.split('/')[0];
      const isImage = fileType === 'image';
      const [name, extension] = file.fileName.split('.');
      if (isImage) {
        return (
          <div className="image-wrapper" key={index}>
            <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
              <div className="image-wrapper-content">
                <a onClick={() => this.handlePreview(file.src, isImage, extension)} role="button" tabIndex={0}>
                  <img src={file.src} alt={file.fileName} onLoad={this.props.onLoadImage} />
                </a>
              </div>
              <span className="file-name habla-label">{decodeURI(name)}</span>
            </Tooltip>
          </div>);
      }

      if (extension === 'pdf') {
        return (
          <div className="image-wrapper preview__file-wrapper" key={index} onClick={() => this.handlePreview(file.src, isImage, extension)}>
            <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
              <div className="image-wrapper-content">
                <div className="file-wrapper__extension">
                  <i className="fa fa-file file-icon" aria-hidden="true" />
                  <span className="file-wrapper__file-type">{extension}</span>
                </div>
              </div>
              <span className="file-name habla-label">{decodeURI(name)}</span>
            </Tooltip>
          </div>);
      }

      return (
        <div className="image-wrapper preview__file-wrapper" key={index} onClick={() => this.handlePreview(file.src, isImage, extension)}>
          <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
            <div className="image-wrapper-content">
              <a href={file.src} download={decodeURI(file.fileName)}>
                <div className="file-wrapper__extension">
                  <i className="fa fa-file file-icon" aria-hidden="true" />
                  <span className="file-wrapper__file-type">{extension}</span>
                </div>
              </a>
            </div>
            <span className="file-name habla-label">{decodeURI(name)}</span>
          </Tooltip>
        </div>);
    });
  }

  render() {
    const { images, previewVisible, previewImage, isImage } = this.state;
    const isFile = classNames({
      'is-file': !isImage
    });
    return (
      <div className="preview-images">
        <div className="attachment-icon"><i className="fas fa-paperclip" /></div>
        {this.renderFiles(images)}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className={isFile}>
          { isImage ?
            <img className="PreviewImages__modal-img" alt="" src={previewImage} />
            :
            <iframe title="image-preview" src={previewImage} width="970" height="700" />
          }
        </Modal>
      </div>
    );
  }
}

PreviewImages.propTypes = propTypes;
PreviewImages.defaultProps = defaultProps;

export default PreviewImages;
