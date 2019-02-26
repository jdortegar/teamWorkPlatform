import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from 'antd';

import String from 'src/translations';
import { hablaGrayLogo } from 'src/img';
import './styles/style.css';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
  showHablaModal: PropTypes.func.isRequired,
  titleText: PropTypes.string,
  bodyText: PropTypes.node,
  buttonText: PropTypes.string,
  cancelButton: PropTypes.bool
};

const defaultProps = {
  titleText: 'Title',
  bodyText:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  buttonText: 'Ok',
  cancelButton: true
};

const HablaModal = props => {
  const { visible, titleText, bodyText, buttonText, cancelButton } = props;

  return (
    <div>
      <Modal visible={visible} footer={null} closable={false} width="580px">
        <div className="Subscription_Modal_container">
          <div className="Modal_header">
            <img src={hablaGrayLogo} alt={String.t('Header.logoAlt')} className="img HablaGrayLogo" />
            <h5 className="Modal_title">
              <span className="habla-bold-text">{titleText}</span>
            </h5>
          </div>
          <div className="Modal_body">
            <div className="Modal_subtitle">
              <div className="suscriptionDate">{bodyText}</div>
            </div>
          </div>
          <div className="Modal_footer">
            <div className="Action_buttons">
              {cancelButton && (
                <Button className="Cancel_button" onClick={props.showHablaModal}>
                  {String.t('subscriptionModal.close')}
                </Button>
              )}
              <Button className="Confirm_button" onClick={props.showModal}>
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

HablaModal.propTypes = propTypes;
HablaModal.defaultProps = defaultProps;

export default HablaModal;
