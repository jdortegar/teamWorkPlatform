import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { antValidate, firstName as lastNameRules } from '../../../validations';
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
  componentKey: 'lastName',
  initialValue: '',
  placeholder: null,
  required: false,
  missingMessage: null,
  layout: {},
  label: 'Last Name'
};

function LastNameField(props) {
  const { layout, label, missingMessage, placeholder, ...rest } = props;

  const translatedPlaceHolder = placeholder || messages.lastName;
  const translatedMissingMessage = missingMessage || messages.lastNameMissing;
  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    extraRules: [{
      validator: antValidate(lastNameRules())
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

LastNameField.propTypes = propTypes;
LastNameField.defaultProps = defaultProps;

export default LastNameField;
