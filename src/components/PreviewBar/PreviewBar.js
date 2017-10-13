import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';
import PreviewCard from '../cards/PreviewCard';
import messages from './messages';
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
  })
};

const defaultProps = {
  files: [],
  replyTo: {
    text: '',
    firstName: '',
    lastName: ''
  }
};

class PreviewBar extends Component {

  renderPreviewCards() {
    return this.props.files.map((file, index) => {
      return (
        <PreviewCard
          file={file}
          key={index}
          handleRemove={() => this.props.removeFileFromList(file)}
          addBase={this.props.addBase}
        />);
    });
  }

  render() {
    const { replyTo, user, files } = this.props;
    return (
      <Row type="flex" justify="start" align="middle" gutter={20} className="PreviewBar__message_reply-container">
        <Col
          xs={{ span: 21 }}
          style={{ borderLeft: `6px solid ${replyTo ? replyTo.preferences.iconColor : user.preferences.iconColor}` }}
        >
          {
            replyTo ?
              <div>
                <p className="PreviewBar__message-body-name">{replyTo.firstName} {replyTo.lastName}</p>
                <p className="PreviewBar__message-body-text">
                  {this.props.replyTo.text}
                </p>
              </div> : null
          }
          <div className="PreviewBar__files-container">
            {
              this.props.isDraggingOver && files.length === 0 ?
                <div className="PreviewBar__file-placeholder-container">
                  <span className="PreviewBar__file-placeholder-icon"><Icon type="upload" /></span>
                  <h2 className="PreviewBar__file-placeholder-title">Drop your files here</h2>
                </div> :
                this.renderPreviewCards()
            }
          </div>
        </Col>
        <Col xs={{ span: 3 }} className="PreviewBar__message-cancel-reply-col">
          <a className="PreviewBar__message-cancel-reply" onClick={this.props.onCancelReply} title={messages.cancel}>
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
