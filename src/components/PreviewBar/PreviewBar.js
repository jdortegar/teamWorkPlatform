import React, { Component } from 'react';
import { Progress, Icon } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { PreviewCard } from 'src/components';
import './styles/style.css';

const propTypes = {
  files: PropTypes.array,
  fileProgress: PropTypes.object,
  onCancelReply: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  removeFileFromList: PropTypes.func.isRequired
};

const defaultProps = {
  files: [],
  fileProgress: null
};

const getProgressBar = percent => {
  const percentComp = !percent ? 0 : percent;
  return <Progress percent={percentComp} strokeWidth={5} showInfo={false} />;
};

class PreviewBar extends Component {
  renderPreviewCards = () => {
    const { files, fileProgress, removeFileFromList, addBase } = this.props;
    return files.map(file => {
      const item = file;
      if (fileProgress && file.name === fileProgress.name && file.size === fileProgress.size) {
        item.percent = fileProgress.percent;
      }
      return (
        <div key={file.name} className="PreviewBar__image-wrapper image-wrapper">
          <div className="image-wrapper-content">
            <PreviewCard
              showCloseIcon={files.length > 1}
              file={file}
              handleRemove={() => removeFileFromList(file)}
              addBase={addBase}
            />
            {getProgressBar(item.percent)}
          </div>
          <span className="file-name habla-label">{file.name}</span>
        </div>
      );
    });
  };

  render() {
    const { files, onCancelReply, isDraggingOver } = this.props;
    if (!isDraggingOver && files.length === 0) return null;

    return (
      <div className="PreviewBar__message_reply-wrapper">
        <div className="PreviewBar__message_reply-container">
          <div className="PreviewBar__message-cancel-reply-col">
            <a className="PreviewBar__message-cancel-reply" onClick={onCancelReply} title={String.t('cancelButton')}>
              <i className="fas fa-times-circle" />
            </a>
          </div>
          <div>
            <div className="PreviewBar__files-container">
              {isDraggingOver && files.length === 0 ? (
                <div className="PreviewBar__file-placeholder-container">
                  <span className="PreviewBar__file-placeholder-icon">
                    <Icon type="upload" />
                  </span>
                  <h2 className="PreviewBar__file-placeholder-title">{String.t('previewBar.dropFilesPlaceholder')}</h2>
                </div>
              ) : (
                this.renderPreviewCards()
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PreviewBar.propTypes = propTypes;
PreviewBar.defaultProps = defaultProps;

export default PreviewBar;
