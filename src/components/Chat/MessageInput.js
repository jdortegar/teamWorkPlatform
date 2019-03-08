import React from 'react';
import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

import { formShape } from 'src/propTypes';
import { Form, Tooltip, Input, message as msg } from 'antd';
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
  form: formShape.isRequired,
  files: PropTypes.array,
  user: PropTypes.object.isRequired,
  conversation: PropTypes.shape({
    conversationId: PropTypes.string.isRequired
  }),
  iAmTyping: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func.isRequired,
  addBase: PropTypes.func.isRequired,
  clearFileList: PropTypes.func.isRequired,
  updateFileList: PropTypes.func.isRequired,
  isDraggingOver: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string.isRequired,
  orgId: PropTypes.string.isRequired,
  setLastSubmittedMessage: PropTypes.func.isRequired,
  replyTo: PropTypes.object,
  resetReplyTo: PropTypes.func.isRequired
};

const defaultProps = {
  conversation: {},
  files: [],
  replyTo: {}
};

function getPercentOfRequest(total, loaded) {
  const percent = (loaded * 100) / total;
  return Math.round(percent);
}

class MessageInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPreviewBox: false,
      file: null,
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
    const { conversationId } = this.props.conversation;
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

  shouldDisableSubmit = () => {
    const textOrig = this.props.form.getFieldValue('message');
    if (!textOrig) return false;
    const text = textOrig.trim();
    const { files } = this.props;
    return !(files && files.length) && !(text && text.length);
  };

  stopTyping = () => {
    const { conversationId } = this.props.conversation;
    this.props.iAmTyping(conversationId, false);
  };

  clearTypingTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  };

  handleSubmit = e => {
    if (this.shouldDisableSubmit()) {
      return;
    }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { conversationId } = this.props.conversation;
        const postBody = { content: [] };
        const message = values.message ? values.message.trim() : '';

        this.stopTyping();
        this.clearTypingTimer();

        if (this.props.files && this.props.files.length > 0) {
          const resources = this.props.files.map(file => this.createResource(file));
          Promise.all(resources)
            .then(res => {
              this.props.form.resetFields();
              postBody.content = res.map((createdResource, index) => ({
                type: this.props.files[index].type,
                resourceId: createdResource.data.resourceId,
                meta: {
                  fileName: this.props.files[index].name,
                  fileSize: this.props.files[index].size,
                  lastModified: this.props.files[index].lastModifiedDate
                }
              }));
              if (message) {
                postBody.content.push({ type: 'text/plain', text: message });
              }
              if (this.state.replyTo) {
                const { messageId } = this.state.replyTo;
                postBody.replyTo = messageId;
                this.setState({ replyTo: null, showPreviewBox: false });
                this.props.resetReplyTo();
              }
              this.props.createMessage(postBody, conversationId);
              this.setState({ showPreviewBox: false, file: null });
              this.props.resetReplyTo();
              this.props.clearFileList();
            })
            .catch(error => {
              this.props.updateFileList(this.props.files);
              this.setState({ file: null });
              msg.error(error.message);
            });
        } else if (message) {
          postBody.content.push({ type: 'text/plain', text: message });
          if (this.state.replyTo) {
            const { messageId } = this.state.replyTo;
            postBody.replyTo = messageId;
            this.setState({ replyTo: null, showPreviewBox: false });
            this.props.resetReplyTo();
          }
          this.props.createMessage(postBody, conversationId).catch(error => msg.error(error.message));
          this.props.setLastSubmittedMessage(message);
          this.props.form.resetFields();
        }
      }
    });
  };

  createResource(file) {
    const fileSource = file.src.split('base64,')[1] || file.src;
    const { conversation, orgId } = this.props;

    const { conversationId } = conversation;

    if (!conversationId || !orgId) {
      // Todo throw error invalid team or subscriberOrg
      throw new Error();
    }
    const keyImageId = conversationId;

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/octet-stream',
        'x-hablaai-content-type': file.type,
        'x-hablaai-content-length': fileSource.length,
        'x-hablaai-teamid': keyImageId,
        'x-hablaai-subscriberorgid': orgId
      },
      onUploadProgress: progressEvent => {
        const { total, loaded } = progressEvent;
        const fileWithPercent = Object.assign(file, { percent: getPercentOfRequest(total, loaded) });
        this.setState({
          file: fileWithPercent
        });
      }
    };

    return axios.put(`${this.props.resourcesUrl}/${file.name}`, fileSource, requestConfig);
  }

  updateFiles(files) {
    if (files.length === 0 && !this.state.replyTo) {
      this.setState({ showPreviewBox: false });
    }
    this.props.updateFileList(files);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { user } = this.props;

    return (
      <div>
        {this.state.showPreviewBox && (
          <PreviewBar
            files={this.props.files}
            fileWithPercent={this.state.file}
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
              disabled={this.shouldDisableSubmit()}
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
              disabled={this.shouldDisableSubmit()}
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
