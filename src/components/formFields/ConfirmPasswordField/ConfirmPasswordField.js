import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import BaseInput from '../BaseInput';
import { antValidate, equality } from '../../../validations';
import messages from './messages';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string,
  passwordComponentKey: PropTypes.string,
  initialValue: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool.isRequired,
  missingMessage: PropTypes.string
};

const defaultProps = {
  componentKey: 'confirmPassword',
  passwordComponentKey: 'password',
  layout: {},
  label: 'Confirm Password',
  initialValue: '',
  placeholder: null,
  required: true,
  missingMessage: null
};

function ConfirmPasswordField(props) {
  const { layout, label, missingMessage, placeholder, passwordComponentKey, form, required, ...rest } = props;

  const translatedPlaceHolder = placeholder || messages.confirmPassword;
  const translatedMissingMessage = missingMessage || messages.confirmPasswordMissing;

  const comparator = value => value === form.getFieldValue(passwordComponentKey);
  const message = messages.passwordNoMatch;

  const decoratedInput = BaseInput({
    ...rest,
    form,
    required,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    type: 'password',
    extraRules: [
      { validator: antValidate(equality(null, comparator, { equality: message })) }
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

ConfirmPasswordField.propTypes = propTypes;
ConfirmPasswordField.defaultProps = defaultProps;

export default ConfirmPasswordField;
