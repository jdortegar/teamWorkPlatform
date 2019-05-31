import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import uuid from 'uuid/v4';

import { Form, Modal, Button, DatePicker, Input, message as msg } from 'antd';
import String from 'src/translations';
import { ChatMessage } from 'src/containers';
import './styles/style.css';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  showScheduleMessageModal: PropTypes.func.isRequired,
  onConfirmed: PropTypes.func,
  text: PropTypes.string,
  message: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  loading: PropTypes.bool,
  action: PropTypes.string,
  okButton: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  conversationIdsByMember: PropTypes.array.isRequired,
  createScheduleMessage: PropTypes.func.isRequired,
  updateScheduleMessage: PropTypes.func.isRequired,
  deleteScheduleMessage: PropTypes.func.isRequired,
  scheduleGlobalMessagesById: PropTypes.array
};

const defaultProps = {
  title: 'Schedule Message',
  subtitle: 'Subtitle',
  text: '',
  message: null,
  loading: false,
  action: null,
  okButton: 'Schedule Send',
  scheduleGlobalMessagesById: null,
  onConfirmed: () => {}
};

class ScheduleMessageModal extends React.Component {
  constructor(props) {
    super(props);

    const { message } = this.props;

    this.state = {
      scheduleDate: message ? message.schedule : null,
      editMessage: '',
      loadingAction: false
    };
  }

  // build Message Object if is new
  buildMessageforRender = text => {
    const { currentUser } = this.props;
    return { content: [{ text, type: 'text/plain' }], userId: currentUser.userId };
  };

  // Date Picker Events
  onOk = value => {
    this.setState({ scheduleDate: value });
  };

  editMessage = value => {
    this.setState({ editMessage: value });
  };

  handleConfirm = async e => {
    const {
      action,
      onConfirmed,
      message,
      conversationIdsByMember,
      deleteScheduleMessage,
      updateScheduleMessage,
      scheduleGlobalMessagesById
    } = this.props;
    const { editMessage, scheduleDate } = this.state;

    switch (action) {
      case 'cancel':
        if (message.appData.globalScheduleId) {
          try {
            await Promise.all(scheduleGlobalMessagesById.map(messageEl => deleteScheduleMessage(messageEl))).then(
              () => {
                this.setState({ loadingAction: false });
                this.props.showScheduleMessageModal(false);
                msg.success(String.t('scheduleMessage.scheduleCanceled'));
              }
            );
          } catch (error) {
            this.setState({ loadingAction: false });
            msg.error(error.message);
          }
        } else {
          deleteScheduleMessage(message)
            .then(() => {
              this.props.showScheduleMessageModal(false);
              msg.success(String.t('scheduleMessage.scheduleCanceled'));
            })
            .catch(error => {
              msg.error(error.message);
            });
        }

        break;
      case 'edit':
        if (message.appData.globalScheduleId) {
          try {
            await Promise.all(
              scheduleGlobalMessagesById.map(messageEl => updateScheduleMessage(messageEl, editMessage, scheduleDate))
            ).then(() => {
              this.setState({ loadingAction: false });
              this.props.showScheduleMessageModal(false);
              msg.success(String.t('scheduleMessage.scheduleEdited'));
            });
          } catch (error) {
            this.setState({ loadingAction: false });
            msg.error(error.message);
          }
        } else {
          updateScheduleMessage(message, editMessage, scheduleDate)
            .then(() => {
              this.props.showScheduleMessageModal(false);
              msg.success(String.t('scheduleMessage.scheduleEdited'));
            })
            .catch(error => {
              msg.error(error.message);
            });
        }
        break;
      case 'createGlobal': {
        this.setState({ loadingAction: true });

        const text = editMessage;
        const date = scheduleDate;
        const appData = {
          globalScheduleId: uuid(),
          sortId: uuid(),
          type: 'scheduleMessage'
        };

        try {
          await Promise.all(
            conversationIdsByMember.map(conversationId =>
              this.props.createScheduleMessage({ text, conversationId, date, appData })
            )
          ).then(() => {
            this.setState({ loadingAction: false });
            this.props.showScheduleMessageModal(false);
            msg.success(String.t('scheduleMessage.confirmMessage'));
          });
        } catch (error) {
          this.setState({ loadingAction: false });
          msg.error(error.message);
        }
        break;
      }
      default:
        onConfirmed(e, this.state.scheduleDate);
        break;
    }
  };

  render() {
    const { visible, text, showScheduleMessageModal, title, subtitle, loading, action, message, okButton } = this.props;

    const { editMessage, loadingAction, scheduleDate } = this.state;

    let modalTitle;
    let messageToRender;
    if (action === 'cancel') {
      modalTitle = String.t('scheduleMessage.deleteScheduledMessage');
      messageToRender = message;
    } else if (action === 'edit') {
      modalTitle = String.t('scheduleMessage.editScheduledMessage');
      messageToRender = editMessage === '' ? message : this.buildMessageforRender(editMessage);
    } else if (action === 'createGlobal') {
      modalTitle = String.t('scheduleMessage.globalScheduleMessage');
      messageToRender = this.buildMessageforRender(editMessage);
    } else {
      modalTitle = title;
      messageToRender = this.buildMessageforRender(text);
    }

    return (
      <div>
        <Modal visible={visible} footer={null} width="450px" closable={false} maskClosable destroyOnClose>
          <div className="Schedule_Message_Modal">
            <div className="Modal_header">
              <h5 className="Modal_title">
                <span className="habla-bold-text">{modalTitle}</span>
                <span className="habla-bold-text subtitle">{subtitle}</span>
              </h5>
            </div>
            <div className="Modal_body">
              <div className="Forwarded_Message_Container">
                <ChatMessage
                  message={messageToRender}
                  key=""
                  conversationId=""
                  conversationDisabled
                  showDetailsOnAvatar={false}
                />
              </div>
              {(action === 'edit' || action === 'createGlobal') && (
                <div className="ScheduleMessage__DatePicker">
                  <Input
                    size="small"
                    placeholder={String.t('Header.writeAMessage')}
                    onChange={e => this.editMessage(e.target.value)}
                    style={{ width: '100%' }}
                    defaultValue={message ? message.content[0].text : null}
                    autoFocus
                  />
                </div>
              )}
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                placeholder={String.t('scheduleMessage.selectDateTime')}
                onOk={this.onOk}
                className="ScheduleMessage__DatePicker"
                format="DD MMM YYYY HH:mm"
                showToday={false}
                disabled={action === 'cancel' || null}
                defaultValue={message ? moment(message.schedule) : null}
                disabledDate={current => {
                  return current && current < moment().subtract(1, 'd');
                }}
              />
            </div>
            <div className="Modal_footer">
              <div className="Action_buttons">
                <Button className="Cancel_button" onClick={() => showScheduleMessageModal(false)}>
                  {String.t('cancelButton')}
                </Button>
                <Button
                  className="Confirm_button"
                  loading={loadingAction || loading}
                  onClick={e => this.handleConfirm(e)}
                  disabled={!scheduleDate}
                >
                  {okButton}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ScheduleMessageModal.propTypes = propTypes;
ScheduleMessageModal.defaultProps = defaultProps;

export default Form.create()(ScheduleMessageModal);
