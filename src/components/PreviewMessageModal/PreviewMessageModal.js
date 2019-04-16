import React from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button } from 'antd';
import String from 'src/translations';
import { ChatMessage } from 'src/containers';
import './styles/style.css';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  showPreviewMessageModal: PropTypes.func.isRequired,
  onConfirmed: PropTypes.func.isRequired,
  message: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

const defaultProps = {
  message: {},
  title: 'Title',
  subtitle: 'Subtitle'
};

const PreviewMessageModal = ({ visible, message, showPreviewMessageModal, onConfirmed, title, subtitle }) => (
  <div>
    <Modal visible={visible} footer={null} width="400px" closable={false} maskClosable destroyOnClose>
      <div className="Preview_Message_Modal">
        <div className="Modal_header">
          <h5 className="Modal_title">
            <span className="habla-bold-text">{title}</span>
            <span className="habla-bold-text subtitle">{subtitle}</span>
          </h5>
        </div>
        <div className="Modal_body">
          <div className="Forwarded_Message_Container">
            <ChatMessage
              message={message}
              key={message.messageId}
              conversationId={message.conversationId}
              conversationDisabled
              showDetailsOnAvatar={false}
            />
          </div>
        </div>
        <div className="Modal_footer">
          <div className="Action_buttons">
            <Button className="Cancel_button" onClick={() => showPreviewMessageModal(false)}>
              {String.t('cancelButton')}
            </Button>
            <Button className="Confirm_button" onClick={() => onConfirmed()}>
              {String.t('okButton')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
);

PreviewMessageModal.propTypes = propTypes;
PreviewMessageModal.defaultProps = defaultProps;

export default Form.create()(PreviewMessageModal);
