import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import { antValidate, passwordI18N } from '../../../validations';
import BaseInput from '../BaseInput';
import messages from './messages';

const FormItem = Form.Item;

const propTypes = {
  intl: intlShape.isRequired,
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool.isRequired,
  missingMessage: PropTypes.string,
  validatePassword: PropTypes.bool
};

const defaultProps = {
  componentKey: 'password',
  layout: {},
  label: 'Password',
  initialValue: '',
  placeholder: null,
  required: true,
  missingMessage: null,
  validatePassword: true
};

function PasswordField(props) {
  const { layout, label, missingMessage, placeholder, validatePassword, intl, ...rest } = props;

  const translatedPlaceHolder = placeholder || messages.password;
  const translatedMissingMessage = missingMessage || messages.passwordMissing;

  const extraRules = [];
  if (validatePassword) {
    extraRules.push({ validator: antValidate(passwordI18N(intl)) });
  }

  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    type: 'password',
    extraRules
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

export default injectIntl(PasswordField);
