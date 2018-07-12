import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { antValidate, password } from '../../../validations';
import BaseInput from '../BaseInput';
import String from '../../../translations';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool.isRequired,
  missingMessage: PropTypes.string,
  validatePassword: PropTypes.bool,
  noLabel: PropTypes.bool
};

const defaultProps = {
  componentKey: 'password',
  layout: {},
  label: String.t('labelPassword'),
  initialValue: '',
  placeholder: String.t('labelPasswordPlaceholder'),
  required: true,
  missingMessage: null,
  validatePassword: true,
  noLabel: false
};

function PasswordField(props) {
  const { layout, label, missingMessage, placeholder, validatePassword, noLabel, ...rest } = props;

  const translatedPlaceHolder = placeholder || String.t('labelPasswordPlaceholder');
  const translatedMissingMessage = missingMessage || String.t('errPasswordMissing');

  const extraRules = [];
  if (validatePassword) {
    extraRules.push({ validator: antValidate(password) });
  }

  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    type: 'password',
    extraRules
  });

  if (noLabel) {
    return (
      <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} hasFeedback>
        {decoratedInput}
      </FormItem>
    );
  }
  return (
    <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} label={label} hasFeedback>
      {decoratedInput}
    </FormItem>
  );
}

PasswordField.propTypes = propTypes;
PasswordField.defaultProps = defaultProps;

export default PasswordField;
