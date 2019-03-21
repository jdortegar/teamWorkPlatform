import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tooltip, Input, message as msg } from 'antd';
import { isEmpty } from 'lodash';

import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { formShape } from 'src/propTypes';
import { AvatarWrapper, PreviewBar } from 'src/components';

// Hack for use String functions
import Str from 'src/translations';

const propTypes = {
  user: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  form: formShape.isRequired,
  files: PropTypes.array,
  iAmTyping: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  setLastSubmittedMessage: PropTypes.func.isRequired,
  resetReplyTo: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string.isRequired,
  replyTo: PropTypes.object
};

const defaultProps = {
  files: [],
  replyTo: {}
};

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();

    this.state = {
      showPreviewBox: false,
      fileProgress: null,
      showEmojiPicker: false,
      replyTo: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.replyTo) {
      this.setState({ replyTo: nextProps.replyTo, showPreviewBox: true });
    }

    if (nextProps.isDraggingOver && !this.state.showPreviewBox) {
      this.setState({ showPreviewBox: true });
    }
  }

  onFileChange = event => {
    const { files } = event.target;
    if (files) {
      this.props.updateFileList(files);
      this.setState({ showPreviewBox: true });
    }
  };

  onCancelReply = () => {
    if (this.props.files.length > 0) {
      this.props.clearFileList();
    }
    this.setState({ replyTo: null, showPreviewBox: false });
    this.props.resetReplyTo();
  };

  handleTyping = () => {
    const { conversationId } = this.props;
    this.clearTypingTimer();
    this.typingTimer = setTimeout(this.stopTyping, 5000);
    this.props.iAmTyping(conversationId, true);
  };

  toogleEmojiState = () => {
    if (this.state.showEmojiPicker) {
      document.body.removeEventListener('click', this.emojiMartClickOutsideHandler);
      this.setState({ showEmojiPicker: false });
    } else {
      document.body.addEventListener('click', this.emojiMartClickOutsideHandler);
      this.setState({ showEmojiPicker: true });
    }
  };

  emojiMartClickOutsideHandler = e => {
    let emojiWindowIsOpen = false;
    if (e.path) {
      e.path.forEach(elem => {
        if (elem.classList && elem.classList.contains('emoji-mart')) {
          emojiWindowIsOpen = true;
        }
      });
    }

    if (!emojiWindowIsOpen) {
      this.setState({ showEmojiPicker: false });
      document.body.removeEventListener('click', this.emojiMartClickOutsideHandler);
    }
  };

  addEmoji = e => {
    const { message } = this.props.form.getFieldsValue();
    if (e.unified.length <= 5) {
      const emojiPic = String.fromCodePoint(`0x${e.unified}`);
      this.props.form.setFieldsValue({ message: `${message || ''} ${emojiPic}` });
    } else {
      const sym = e.unified.split('-');
      const codesArray = [];
      sym.forEach(el => codesArray.push(`0x${el}`));
      const emojiPic = String.fromCodePoint(...codesArray);
      this.props.form.setFieldsValue({ message: `${message || ''} ${emojiPic}` });
    }
    this.textInput.current.focus();
  };

  isSubmitInvalid = () => {
    const { files } = this.props;
    const textOrig = this.props.form.getFieldValue('message');
    if (!textOrig) return false;
    const text = textOrig.trim();
    return !(files && files.length) && !(text && text.length);
  };

  stopTyping = () => {
    const { conversationId } = this.props;
    this.props.iAmTyping(conversationId, false);
  };

  clearTypingTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  };

  handleFileUploadProgress = fileProgress => {
    this.setState({ fileProgress });
  };

  handleSubmit = e => {
    if (this.isSubmitInvalid()) return;
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { replyTo } = this.state;
        const { files, form, resourcesUrl, conversationId } = this.props;
        const message = values.message ? values.message.trim() : '';

        this.stopTyping();
        this.clearTypingTimer();

        if (!message && isEmpty(files)) return;
        this.props
          .createMessage({
            message,
            conversationId,
            replyTo,
            resourcesUrl,
            files,
            onFileUploadProgress: this.handleFileUploadProgress
          })
          .then(() => {
            this.setState({ fileProgress: null, showPreviewBox: false });
            this.props.clearFileList();
          })
          .catch(error => {
            if (!isEmpty(files)) {
              this.props.updateFileList(files);
              this.setState({ fileProgress: null });
            }
            msg.error(error.message);
          });

        if (replyTo) {
          this.setState({ replyTo: null, showPreviewBox: false });
          this.props.resetReplyTo();
        }

        this.props.setLastSubmittedMessage(message);
        form.resetFields();
      }
    });
  };

  updateFiles = files => {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { user } = this.props;
    const { fileProgress } = this.state;

    return (
      <div>
        {this.state.showPreviewBox && (
          <PreviewBar
            files={this.props.files}
            fileProgress={fileProgress}
            updateFiles={this.updateFiles}
            removeFileFromList={this.props.removeFileFromList}
            onCancelReply={this.onCancelReply}
            addBase={this.props.addBase}
            replyTo={this.state.replyTo}
            user={user}
            isDraggingOver={this.props.isDraggingOver}
          />
        )}
        <div className="Chat__message_input">
          <div className="team-room__chat-input__image-wrapper">
            <AvatarWrapper size="default" user={user} />
          </div>
          <div className="team-room__chat-input-wrapper">
            <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
              <Form.Item className="team-room__chat-input-form-item" hasFeedback={false}>
                {getFieldDecorator('message', {})(
                  <Input
                    placeholder={Str.t('chat.replyPlaceholder')}
                    className="team-room__chat-input-textfield"
                    onFocus={this.handleTyping}
                    autoFocus
                    ref={this.textInput}
                  />
                )}
              </Form.Item>
            </Form>
          </div>
          <div className="team-room__chat-col-icons">
            <a
              className="team-room__icons"
              role="button"
              tabIndex={0}
              disabled={this.isSubmitInvalid()}
              onClick={() => this.toogleEmojiState()}
            >
              <i className="far fa-smile" />
            </a>
            <div className="emoji-table">{this.state.showEmojiPicker && <Picker onClick={this.addEmoji} />}</div>
            <div>
              <input
                id="fileupload"
                className="team-room__file-upload-input"
                type="file"
                onChange={this.onFileChange}
                multiple
              />
              <label htmlFor="fileupload" className="team-room__icons">
                <Tooltip placement="top" title={Str.t('chat.tooltipAttachments')} arrowPointAtCenter>
                  <i className="fa fa-paperclip" />
                </Tooltip>
              </label>
            </div>
            <a
              className="team-room__icons"
              role="button"
              tabIndex={0}
              disabled={this.isSubmitInvalid()}
              onClick={this.handleSubmit}
            >
              <i className="far fa-paper-plane" />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

MessageInput.propTypes = propTypes;
MessageInput.defaultProps = defaultProps;

export default Form.create()(MessageInput);
