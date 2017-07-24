import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import BaseInput from '../BaseInput';
import { antValidate, password as passwordRules } from '../../../validations';
import messages from './messages';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool.isRequired,
  missingMessage: PropTypes.string
};

const defaultProps = {
  componentKey: 'password',
  layout: {},
  label: 'Password',
  initialValue: '',
  placeholder: null,
  required: true,
  missingMessage: null
};

function PasswordField(props) {
  const { layout, label, missingMessage, placeholder, ...rest } = props;

  const translatedPlaceHolder = placeholder || messages.password;
  const translatedMissingMessage = missingMessage || messages.passwordMissing;

  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    type: 'password',
    extraRules: [
      { validator: antValidate(passwordRules()) }
    ]
  });

  return (
    <FormItem
      labelCol={layout.labelCol}
      wrapperCol={layout.wrapperCol}
      label={label}
      hasFeedback
    >
      {decoratedInput}
    </FormItem>
  );
}

PasswordField.propTypes = propTypes;
PasswordField.defaultProps = defaultProps;

export default PasswordField;
