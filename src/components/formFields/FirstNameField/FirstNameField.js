import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { antValidate, firstName } from '../../../validations';
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
  componentKey: 'firstName',
  initialValue: '',
  placeholder: null,
  required: false,
  missingMessage: null,
  layout: {},
  label: 'First Name'
};

function FirstNameField(props) {
  const { layout, label, missingMessage, placeholder, ...rest } = props;

  const translatedPlaceHolder = placeholder || messages.firstName;
  const translatedMissingMessage = missingMessage || messages.firstNameMissing;
  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    extraRules: [{
      validator: antValidate(firstName)
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

FirstNameField.propTypes = propTypes;
FirstNameField.defaultProps = defaultProps;

export default FirstNameField;
