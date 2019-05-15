import React from 'react';
import PropTypes from 'prop-types';
import { Form, Tooltip, message as msg } from 'antd';
import { isEmpty, last, size } from 'lodash';
import classNames from 'classnames';

import Str from 'src/translations';
import { Picker } from 'emoji-mart';
import { formShape } from 'src/propTypes';
import { PreviewBar } from 'src/components';
import { AvatarWrapper, ScheduleMessageModal } from 'src/containers';
import InlineSuggest from './InlineSuggest';

import 'emoji-mart/css/emoji-mart.css';
import './styles/style.css';

import data from './data';

const propTypes = {
  user: PropTypes.object.isRequired,
  currentConversationUserFullName: PropTypes.string,
  team: PropTypes.object,
  conversationId: PropTypes.string.isRequired,
  form: formShape.isRequired,
  files: PropTypes.array,
  sendTyping: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  createScheduleMessage: PropTypes.func.isRequired,
  updateMessage: PropTypes.func.isRequired,
  removeFileFromList: PropTypes.func,
  addBase: PropTypes.func,
  clearFileList: PropTypes.func,
  updateFileList: PropTypes.func,
  setLastSubmittedMessage: PropTypes.func,
  isDraggingOver: PropTypes.bool,
  replyTo: PropTypes.object,
  messageToEdit: PropTypes.object,
  handleEditMessage: PropTypes.func,
  handleReplyMessage: PropTypes.func,
  handleEditingAction: PropTypes.func
};

const defaultProps = {
  team: null,
  currentConversationUserFullName: null,
  files: [],
  replyTo: null,
  messageToEdit: null,
  removeFileFromList: null,
  addBase: null,
  updateFileList: null,
  isDraggingOver: null,
  clearFileList: () => {},
  handleEditMessage: () => {},
  handleReplyMessage: () => {},
  setLastSubmittedMessage: () => {},
  handleEditingAction: () => {}
};

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();

    this.state = {
      showPreviewBox: false,
      fileProgress: null,
      scheduleModalVisible: false,
      textToEdit: null,
      loadingScheduleConfirm: null
    };
  }

  componentDidMount() {
    const { messageToEdit } = this.props;
    if (messageToEdit) {
      const attachments = messageToEdit.content.find(el => el.type === 'text/plain');
      this.setState({ textToEdit: attachments ? attachments.text : null });
    }
  }

  componentWillReceiveProps(nextProps) {
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

  handleKeyDown = event => {
    if (event.keyCode === 27) {
      this.props.handleEditingAction({ userIsEditing: false });
      this.props.handleEditMessage(false);
      this.props.handleReplyMessage(false);
    }
  };

  handleTyping = () => {
    const { conversationId } = this.props;
    this.clearTypingTimer();
    this.typingTimer = setTimeout(this.stopTyping, 5000);
    this.props.sendTyping(conversationId, true);
  };

  stopTyping = () => {
    const { conversationId } = this.props;
    this.props.sendTyping(conversationId, false);
  };

  clearTypingTimer = () => {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
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

  onCancelReply = () => {
    this.setState({ showPreviewBox: false });
    if (!isEmpty(this.props.files)) {
      this.props.clearFileList();
    }
  };

  handleFileUploadProgress = fileProgress => {
    this.setState({ fileProgress });
  };

  createMessages = async text => {
    const { conversationId, replyTo, files, createMessage } = this.props;

    if (isEmpty(files)) {
      return createMessage({ text, conversationId, replyTo });
    }

    const requests = files.map((file, index) =>
      createMessage({
        text: index === 0 ? text : undefined, // add text to first message only
        conversationId,
        replyTo,
        file,
        onFileUploadProgress: this.handleFileUploadProgress
      })
    );
    const messages = await Promise.all(requests);
    return last(messages);
  };

  sendMessages = async text => {
    const { files } = this.props;
    if (!text && isEmpty(files)) return;

    try {
      const lastMessage = await this.createMessages(text);
      this.setState({ fileProgress: null, showPreviewBox: false });
      this.props.setLastSubmittedMessage(lastMessage);
      this.props.handleReplyMessage(false);
      this.props.clearFileList();
    } catch (e) {
      msg.error(e.message);
      this.props.handleReplyMessage(false);
      if (!isEmpty(files)) {
        this.props.updateFileList(files);
        this.setState({ fileProgress: null });
      }
    }
  };

  updateMessage = async (message, text) => {
    if (!text) return;
    try {
      this.props.handleEditMessage(false);
      await this.props.updateMessage(message, text);
    } catch (error) {
      msg.error(error.message);
      this.props.handleEditMessage(true);
    }
  };

  handleSubmit = e => {
    if (this.isSubmitInvalid()) return;
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { form, messageToEdit } = this.props;
        const text = values.message ? values.message.trim() : '';

        console.warn('TEXT SUBMITTED:', text);

        this.stopTyping();
        this.clearTypingTimer();

        if (messageToEdit) {
          this.updateMessage(messageToEdit, text);
        } else {
          this.sendMessages(text);
        }

        form.resetFields();
      }
    });
  };

  showScheduleMessageModal = hide => {
    const { message } = this.props.form.getFieldsValue();
    const text = message ? message.trim() : '';
    if (text.length === 0) {
      msg.warning(Str.t('scheduleMessage.warningMessage'));
    } else {
      if (!hide) return this.setState({ scheduleModalVisible: false, loadingScheduleConfirm: false });
      return this.setState({ scheduleModalVisible: !this.state.scheduleModalVisible });
    }
    return false;
  };

  handleScheduleMessage = (e, date) => {
    if (this.isSubmitInvalid()) return;
    e.preventDefault();

    this.setState({ loadingScheduleConfirm: true });

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { form } = this.props;
        const text = values.message ? values.message.trim() : '';

        this.stopTyping();
        this.clearTypingTimer();

        const { files } = this.props;
        if (!text && isEmpty(files)) return;

        try {
          const { conversationId, replyTo, createScheduleMessage } = this.props;

          if (isEmpty(files)) {
            createScheduleMessage({ text, conversationId, replyTo, date });
          } else {
            const requests = files.map((file, index) =>
              createScheduleMessage({
                text: index === 0 ? text : undefined, // add text to first message only
                conversationId,
                replyTo,
                file,
                onFileUploadProgress: this.handleFileUploadProgress,
                date
              })
            );

            await Promise.all(requests);
          }

          this.setState({ fileProgress: null, showPreviewBox: false });
          this.props.handleReplyMessage(false);
          this.props.clearFileList();

          this.setState({ loadingScheduleConfirm: false });
          this.showScheduleMessageModal(false);

          msg.success(Str.t('scheduleMessage.confirmMessage'));
        } catch (error) {
          msg.error(error.message);
          this.props.handleReplyMessage(false);
          if (!isEmpty(files)) {
            this.props.updateFileList(files);
            this.setState({ fileProgress: null });
          }
        }

        form.resetFields();
      }
    });
  };

  render() {
    const { user, messageToEdit, team, currentConversationUserFullName, form } = this.props;
    const { fileProgress, textToEdit } = this.state;
    const { message } = form.getFieldsValue();

    return (
      <div>
        {this.state.showPreviewBox && (
          <PreviewBar
            files={this.props.files}
            fileProgress={fileProgress}
            onCancelReply={this.onCancelReply}
            addBase={this.props.addBase}
            isDraggingOver={this.props.isDraggingOver}
            removeFileFromList={this.props.removeFileFromList}
          />
        )}
        <div className={classNames('Chat__message_input', { Chat__message_edit_input: messageToEdit })}>
          <div className="team-room__chat-input__image-wrapper">
            <AvatarWrapper size="default" user={user} showDetails={false} />
          </div>
          <div className="team-room__chat-input-wrapper">
            <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
              <Form.Item className="team-room__chat-input-form-item" hasFeedback={false}>
                <InlineSuggest
                  navigate
                  form={form}
                  suggestions={data}
                  initialValue={textToEdit}
                  shouldRenderSuggestion={val => size(val) >= 2}
                  onInputKeyDown={this.handleKeyDown}
                  onInputFocus={this.handleTyping}
                  inputClassName="team-room__chat-input-textfield"
                  inputProps={{
                    placeholder: Str.t('chat.replyPlaceholder'),
                    ref: this.textInput,
                    autoFocus: true
                  }}
                />
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
            {this.state.showEmojiPicker && (
              <div className="emoji-table">
                <Picker onClick={this.addEmoji} />
              </div>
            )}
            <a
              className="team-room__icons"
              role="button"
              tabIndex={0}
              disabled={this.isSubmitInvalid()}
              onClick={this.showScheduleMessageModal}
            >
              <i className="far fa-clock" />
            </a>
            {this.state.scheduleModalVisible && (
              <ScheduleMessageModal
                subtitle={team ? team.name : currentConversationUserFullName}
                text={message}
                visible={this.state.scheduleModalVisible}
                showScheduleMessageModal={this.showScheduleMessageModal}
                onConfirmed={this.handleScheduleMessage}
                loading={this.state.loadingScheduleConfirm}
              />
            )}
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
