import React from 'react';
import { Icon, Form } from 'antd';
import PropTypes from 'prop-types';
import { formShape } from '../../../propTypes';
import { antValidate, email as emailRules } from '../../../validations';
import BaseInput from '../BaseInput';
import messages from './messages';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  layout: PropTypes.object,
  required: PropTypes.bool,
  missingMessage: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  inputClassName: PropTypes.string
};

const defaultProps = {
  componentKey: 'email',
  initialValue: null,
  label: 'Email',
  required: false,
  missingMessage: null,
  placeholder: 'Email',
  layout: {},
  icon: undefined,
  inputClassName: null
};

function EmailField(props) {
  const {
    componentKey,
    layout,
    label,
    form,
    initialValue,
    missingMessage,
    placeholder,
    required,
    icon,
    inputClassName,
    ...other
  } = props;

  const translatedMissingMessage = missingMessage || messages.emailMissing;
  const translatedPlaceHolder = placeholder || messages.email;

  const decoratedInput = BaseInput({
    ...other,
    form,
    componentKey,
    initialValue,
    placeholder: translatedPlaceHolder,
    required,
    extraRules: [
      { validator: antValidate(emailRules()) }
    ],
    className: inputClassName,
    missingMessage: translatedMissingMessage,
    prefix: icon !== undefined ? icon : <Icon type="mail" />
  });

  return (
    <FormItem
      labelCol={layout.labelCol}
      wrapperCol={layout.wrapperCol}
      label={label}
      hasFeedback
      required={required}
    >
      {decoratedInput}
    </FormItem>
  );
}

EmailField.propTypes = propTypes;
EmailField.defaultProps = defaultProps;

export default EmailField;
