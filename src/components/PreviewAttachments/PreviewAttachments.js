import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import './styles/style.css';

const propTypes = {
  orgId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  attachments: PropTypes.array,
  conversationId: PropTypes.string,
  onLoadImage: PropTypes.func
};

const defaultProps = {
  attachments: [],
  onLoadImage: null,
  conversationId: null
};

class PreviewAttachments extends Component {
  state = {
    previewVisible: false,
    isImage: true,
    previewImage: '',
    files: []
  };

  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = () => {
    const { attachments, conversationId, orgId, token } = this.props;
    const files = [];
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-hablaai-teamid': conversationId,
        'x-hablaai-subscriberorgid': orgId
      }
    };

    attachments.forEach(image => {
      const { resourceId } = image;
      axios
        .get(`https://uw33cc3bz4.execute-api.us-west-2.amazonaws.com/dev/resource/${resourceId}`, headers)
        .then(resource => {
          files.push({
            src: `data:${resource.headers['x-hablaai-content-type']};base64,${resource.data}`,
            contentType: resource.headers['x-hablaai-content-type'],
            fileName: resource.headers['x-hablaai-filename']
          });
          this.setState({ files });
        });
    });
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = (file, isImage, extension) => {
    this.setState({
      isImage,
      previewVisible: isImage || extension === 'pdf',
      previewImage: file
    });
  };

  renderPreview = file => {
    const fileType = file.contentType.split('/')[0];
    const isImage = fileType === 'image';
    const [name, extension] = file.fileName.split('.');

    if (isImage) {
      return (
        <div
          className="image-wrapper"
          key={file.fileName}
          onClick={() => this.handlePreview(file.src, isImage, extension)}
        >
          <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
            <div className="image-wrapper-content">
              <a role="button" tabIndex={0}>
                <img src={file.src} alt={file.fileName} onLoad={this.props.onLoadImage} />
              </a>
            </div>
            <span className="file-name habla-label">{decodeURI(name)}</span>
          </Tooltip>
        </div>
      );
    }

    if (extension === 'pdf') {
      return (
        <div
          className="image-wrapper preview__file-wrapper"
          key={file.fileName}
          onClick={() => this.handlePreview(file.src, isImage, extension)}
        >
          <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
            <div className="image-wrapper-content">
              <div className="file-wrapper__extension">
                <i className="fa fa-file file-icon" aria-hidden="true" />
                <span className="file-wrapper__file-type">{extension}</span>
              </div>
            </div>
            <span className="file-name habla-label">{decodeURI(name)}</span>
          </Tooltip>
        </div>
      );
    }

    return (
      <div
        className="image-wrapper preview__file-wrapper"
        key={file.fileName}
        onClick={() => this.handlePreview(file.src, isImage, extension)}
      >
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
      </div>
    );
  };

  render() {
    if (isEmpty(this.props.attachments)) return null;

    const { files, previewVisible, previewImage, isImage } = this.state;

    return (
      <div className="preview-images">
        <div className="attachment-icon">
          <i className="fas fa-paperclip" />
        </div>

        {files.map(this.renderPreview)}

        <Modal
          className={classNames({ 'is-file': !isImage })}
          visible={previewVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          {isImage ? (
            <img className="PreviewAttachments__modal-img" alt="" src={previewImage} />
          ) : (
            <iframe title="image-preview" src={previewImage} width="970" height="700" />
          )}
        </Modal>
      </div>
    );
  }
}

PreviewAttachments.propTypes = propTypes;
PreviewAttachments.defaultProps = defaultProps;

export default PreviewAttachments;
