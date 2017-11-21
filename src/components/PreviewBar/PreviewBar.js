import React, { Component } from 'react';
import { Row, Col, Icon, Progress } from 'antd';
import PropTypes from 'prop-types';
import PreviewCard from '../cards/PreviewCard';
import './styles/style.css';
import String from '../../translations';

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
  fileWithPercent: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const defaultProps = {
  files: [],
  replyTo: {
    text: '',
    firstName: '',
    lastName: ''
  }
};

function getProgressBar(percent) {
  const percentComp = !percent ? 0 : percent;
  return (
    <Progress
      percent={percentComp}
      strokeWidth={5}
      showInfo={false}
    />
  );
}

class PreviewBar extends Component {
  renderPreviewCards() {
    const { fileWithPercent } = this.props;

    return this.props.files.map((el, index) => {
      const item = el;
      if (fileWithPercent !== null && el.name === fileWithPercent.name && el.size === fileWithPercent.size) {
        item.percent = fileWithPercent.percent;
      }
      return (
        <div key={index} className="PreviewBar__image-wrapper">
          <PreviewCard
            file={item}
            handleRemove={() => this.props.removeFileFromList(item)}
            addBase={this.props.addBase}
          />
          {getProgressBar(item.percent)}
        </div>
      );
    });
  }

  render() {
    const { replyTo, user, files } = this.props;
    const name = String.t('previewBar.name', replyTo);
    return (
      <Row type="flex" justify="start" align="middle" gutter={20} className="PreviewBar__message_reply-container">
        <Col
          xs={{ span: 21 }}
          style={{ borderLeft: `6px solid ${replyTo ? replyTo.preferences.iconColor : user.preferences.iconColor}` }}
        >
          {
            replyTo ?
              <div>
                <p className="PreviewBar__message-body-name">{name}</p>
                <p className="PreviewBar__message-body-text">{replyTo.text}</p>
              </div> : null
          }
          <div className="PreviewBar__files-container">
            {
              this.props.isDraggingOver && files.length === 0 ?
                <div className="PreviewBar__file-placeholder-container">
                  <span className="PreviewBar__file-placeholder-icon"><Icon type="upload" /></span>
                  <h2 className="PreviewBar__file-placeholder-title">{String.t('previewBar.dropFilesPlaceholder')}</h2>
                </div> :
                this.renderPreviewCards()
            }
          </div>
        </Col>
        <Col xs={{ span: 3 }} className="PreviewBar__message-cancel-reply-col">
          <a className="PreviewBar__message-cancel-reply" onClick={this.props.onCancelReply} title={String.t('cancelButton')}>
            <Icon type="close-circle-o" />
          </a>
        </Col>
      </Row>
    );
  }
}

PreviewBar.propTypes = propTypes;
PreviewBar.defaultProps = defaultProps;

export default PreviewBar;
