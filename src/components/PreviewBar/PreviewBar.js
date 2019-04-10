import React, { Component } from 'react';
import { Progress, Icon } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { PreviewCard } from 'src/components';
import './styles/style.css';

const propTypes = {
  files: PropTypes.array,
  onCancelReply: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  replyTo: PropTypes.shape({
    text: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    preferences: PropTypes.shape({
      iconColor: PropTypes.string.isRequired
    }).isRequired
  }),
  removeFileFromList: PropTypes.func.isRequired,
  fileProgress: PropTypes.object
};

const defaultProps = {
  files: [],
  replyTo: {
    text: '',
    firstName: '',
    lastName: ''
  },
  fileProgress: null
};

function getProgressBar(percent) {
  const percentComp = !percent ? 0 : percent;
  return <Progress percent={percentComp} strokeWidth={5} showInfo={false} />;
}

class PreviewBar extends Component {
  renderPreviewCards = () => {
    const { fileProgress } = this.props;
    return this.props.files.map(el => {
      const item = el;
      if (fileProgress !== null && el.name === fileProgress.name && el.size === fileProgress.size) {
        item.percent = fileProgress.percent;
      }
      return (
        <div key={item.name} className="PreviewBar__image-wrapper image-wrapper">
          <div className="image-wrapper-content">
            <PreviewCard
              file={item}
              handleRemove={() => this.props.removeFileFromList(item)}
              addBase={this.props.addBase}
            />
            {getProgressBar(item.percent)}
          </div>
          <span className="file-name habla-label">{item.name}</span>
        </div>
      );
    });
  };

  render() {
    const { replyTo, files } = this.props;
    const name = String.t('previewBar.name', replyTo);
    return (
      <div className="PreviewBar__message_reply-wrapper">
        <div className="PreviewBar__message_reply-container">
          <div className="PreviewBar__message-cancel-reply-col">
            <a
              className="PreviewBar__message-cancel-reply"
              onClick={this.props.onCancelReply}
              title={String.t('cancelButton')}
            >
              <i className="fas fa-times-circle" />
            </a>
          </div>
          <div>
            {replyTo ? (
              <div className="Reply__header_container">
                <i className="fas fa-reply" />
                <p className="PreviewBar__message-body-name">{name}</p>
                <p className="PreviewBar__message-body-text">{replyTo.text}</p>
              </div>
            ) : null}
            <div className="PreviewBar__files-container">
              {this.props.isDraggingOver && files.length === 0 ? (
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
