import React from 'react';
import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react';
import { Form, Tooltip, Input, message as msg } from 'antd';
import { isEmpty } from 'lodash';

import { formShape } from 'src/propTypes';
import { AvatarWrapper, PreviewBar } from 'src/components';
import JSEMOJI from 'emoji-js';
import String from 'src/translations';

// emoji set up
const jsemoji = new JSEMOJI();
// set the style to emojione (default - apple)
jsemoji.img_set = 'emojione';
// set the storage location for all emojis
jsemoji.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/';

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
  state = {
    showPreviewBox: false,
    fileProgress: null,
    showEmojiPicker: false,
    replyTo: null
  };

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
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker });
  };

  // Hande emoticons when are clicked
  handleEmojiClick = (n, e) => {
    const emoji = jsemoji.replace_colons(`:${e.name}:`);
    const { message } = this.props.form.getFieldsValue();
    this.props.form.setFieldsValue({ message: `${message || ''} ${emoji}` });
    this.setState({ showEmojiPicker: false });
  };

  toogleEmojiState = () => {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker });
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
                    placeholder={String.t('chat.replyPlaceholder')}
                    className="team-room__chat-input-textfield"
                    onFocus={this.handleTyping}
                    autoFocus
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
            <div className="emoji-table">
              {this.state.showEmojiPicker && <EmojiPicker onEmojiClick={this.handleEmojiClick} />}
            </div>
            <div>
              <input
                id="fileupload"
                className="team-room__file-upload-input"
                type="file"
                onChange={this.onFileChange}
                multiple
              />
              <label htmlFor="fileupload" className="team-room__icons">
                <Tooltip placement="top" title={String.t('chat.tooltipAttachments')} arrowPointAtCenter>
                  <i className="fas fa-paperclip" />
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
              <i className="fas fa-paper-plane" />
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
