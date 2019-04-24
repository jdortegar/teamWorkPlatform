import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { isPreviewSupported, getPreviewUrl } from 'src/lib/filePreview';
import './styles/style.css';

const propTypes = {
  attachments: PropTypes.array,
  onLoadImage: PropTypes.func
};

const defaultProps = {
  attachments: [],
  onLoadImage: null
};

class PreviewAttachments extends Component {
  state = {
    isImage: true,
    modalVisible: false,
    fileToPreview: ''
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handlePreview = (fileUrl, isImage, extension) => {
    this.setState({
      isImage,
      fileToPreview: fileUrl,
      modalVisible: isImage || isPreviewSupported(extension)
    });
  };

  renderPreview = file => {
    const { fileName, fileUrl } = file.meta;
    const [fileType] = file.type.split('/');
    const isImage = fileType === 'image';

    // handle '.' in the filename
    const [extension, ...rest] = fileName.split('.').reverse();
    const name = rest.reverse().join('.');

    const previewUrl = !isImage && isPreviewSupported(extension) ? getPreviewUrl(fileUrl, extension) : fileUrl;

    const imagePreview = (
      <a role="button" tabIndex={0}>
        <img src={fileUrl} alt={fileName} onLoad={this.props.onLoadImage} />
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
        key={fileName}
        className={classNames('image-wrapper', { 'preview__file-wrapper': !isImage })}
        onClick={() => this.handlePreview(previewUrl, isImage, extension)}
      >
        <Tooltip placement="top" title={decodeURI(name)} arrowPointAtCenter>
          <div className="image-wrapper-content">
            {isImage && imagePreview}
            {!isImage && isPreviewSupported(extension) && fileIconPreview}
            {!isImage && !isPreviewSupported(extension) && (
              <a href={fileUrl} download={decodeURI(fileName)}>
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
    const { attachments } = this.props;
    const { modalVisible, fileToPreview, isImage } = this.state;

    if (isEmpty(attachments)) return null;

    return (
      <div className="preview-images">
        <div className="attachment-icon">
          <i className="fas fa-paperclip" />
        </div>
        {attachments.map(this.renderPreview)}

        <Modal
          className={classNames({ 'is-file': !isImage })}
          width={!isImage ? 1000 : 540}
          onCancel={this.handleCancel}
          visible={modalVisible}
          footer={null}
        >
          {isImage && <img src={fileToPreview} className="PreviewAttachments__modal-img" alt="" />}
          {!isImage && <iframe src={fileToPreview} title="image-preview" width="944" height="850" />}
        </Modal>
      </div>
    );
  }
}

PreviewAttachments.propTypes = propTypes;
PreviewAttachments.defaultProps = defaultProps;

export default PreviewAttachments;
