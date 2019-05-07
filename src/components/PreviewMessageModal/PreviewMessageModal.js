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
  subtitle: PropTypes.string,
  okButton: PropTypes.string,
  okButtonClass: PropTypes.string,
  content: PropTypes.node
};

const defaultProps = {
  message: null,
  title: 'Title',
  subtitle: null,
  okButton: 'Ok',
  okButtonClass: '',
  content: null
};

const PreviewMessageModal = ({
  visible,
  message,
  showPreviewMessageModal,
  onConfirmed,
  title,
  subtitle,
  okButton,
  okButtonClass,
  content
}) => (
  <div>
    <Modal visible={visible} footer={null} width="450px" closable={false} maskClosable destroyOnClose>
      <div className="Preview_Message_Modal">
        <div className="Modal_header">
          <h5 className="Modal_title">
            <span className="habla-bold-text">{title}</span>
            {subtitle && <span className="habla-bold-text subtitle">{subtitle}</span>}
          </h5>
        </div>
        <div className="Modal_body">
          <div className="Forwarded_Message_Container">
            {message && (
              <ChatMessage
                message={message}
                key={message.messageId}
                conversationId={message.conversationId}
                conversationDisabled
                showDetailsOnAvatar={false}
              />
            )}
            {content}
          </div>
        </div>
        <div className="Modal_footer">
          <div className="Action_buttons">
            <Button className="Cancel_button" onClick={() => showPreviewMessageModal(false)}>
              {String.t('cancelButton')}
            </Button>
            <Button className={okButtonClass} onClick={() => onConfirmed()}>
              {okButton}
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
