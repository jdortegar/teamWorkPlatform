import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { isPreviewSupported, getPreviewUrl } from 'src/lib/filePreview';
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
    isImage: true,
    modalVisible: false,
    fileToPreview: '',
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
    this.setState({ modalVisible: false });
  };

  handlePreview = (file, isImage, extension) => {
    this.setState({
      isImage,
      modalVisible: isImage || isPreviewSupported(extension),
      fileToPreview: file
    });
  };

  renderPreview = file => {
    // handle '.' in the filename
    const [extension, ...rest] = file.fileName.split('.').reverse();
    const name = rest.reverse().join('.');
    const [fileType] = file.contentType.split('/');
    const isImage = fileType === 'image';
    const fileSrc = !isImage && isPreviewSupported(extension) ? getPreviewUrl(file.src, extension) : file.src;

    const imagePreview = (
      <a role="button" tabIndex={0}>
        <img src={fileSrc} alt={file.fileName} onLoad={this.props.onLoadImage} />
      </a>
    );
    const fileIconPreview = (
      <div className="file-wrapper__extension">
        <i className="fa fa-file file-icon" aria-hidden="true" />
        <span className="file-wrapper__file-type">{extension}</span>
      </div>
    );

    return (
      <div
        key={file.fileName}
        className={classNames('image-wrapper', { 'preview__file-wrapper': !isImage })}
        onClick={() => this.handlePreview(fileSrc, isImage, extension)}
      >
        <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
          <div className="image-wrapper-content">
            {isImage && imagePreview}
            {!isImage && isPreviewSupported(extension) && fileIconPreview}
            {!isImage && !isPreviewSupported(extension) && (
              <a href={file.src} download={decodeURI(file.fileName)}>
                {fileIconPreview}
              </a>
            )}
          </div>
          <span className="file-name habla-label">{decodeURI(name)}</span>
        </Tooltip>
      </div>
    );
  };

  render() {
    if (isEmpty(this.props.attachments)) return null;

    const { files, modalVisible, fileToPreview, isImage } = this.state;

    return (
      <div className="preview-images">
        <div className="attachment-icon">
          <i className="fas fa-paperclip" />
        </div>
        {files.map(this.renderPreview)}

        <Modal
          className={classNames({ 'is-file': !isImage })}
          width={!isImage ? 1000 : 540}
          onCancel={this.handleCancel}
          visible={modalVisible}
          footer={null}
        >
          {isImage && <img className="PreviewAttachments__modal-img" alt="" src={fileToPreview} />}
          {!isImage && <iframe title="image-preview" src={fileToPreview} width="944" height="700" />}
        </Modal>
      </div>
    );
  }
}

PreviewAttachments.propTypes = propTypes;
PreviewAttachments.defaultProps = defaultProps;

export default PreviewAttachments;
