import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { antValidate, username } from '../../../validations';
import BaseInput from '../BaseInput';
import messages from './messages';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool,
  missingMessage: PropTypes.string
};

const defaultProps = {
  componentKey: 'username',
  initialValue: '',
  placeholder: null,
  required: false,
  missingMessage: null,
  layout: {},
  label: 'Username'
};

function UsernameField(props) {
  const { layout, label, missingMessage, placeholder, ...rest } = props;

  const translatedPlaceHolder = placeholder || messages.username;
  const translatedMissingMessage = missingMessage || messages.usernameMissing;
  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    extraRules: [{
      validator: antValidate(username)
    }]
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

UsernameField.propTypes = propTypes;
UsernameField.defaultProps = defaultProps;

export default UsernameField;
