import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import BaseInput from '../BaseInput';
import String from '../../../translations';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool,
  extraRules: PropTypes.array,
  missingMessage: PropTypes.string,
  validateStatus: PropTypes.string,
  type: PropTypes.string,
  colon: PropTypes.bool,
  hasFeedback: PropTypes.bool,
  inputClassName: PropTypes.string,
  className: PropTypes.string
};

const defaultProps = {
  componentKey: 'input',
  colon: true,
  label: String.t('InputField.defaultLabel'),
  required: false,
  extraRules: [],
  layout: {},
  type: 'text',
  hasFeedback: true,
  inputClassName: null,
  className: null,
  initialValue: null,
  missingMessage: null,
  placeholder: null,
  validateStatus: undefined
};

function TextField(props) {
  const {
    componentKey,
    layout,
    label,
    initialValue,
    required,
    extraRules,
    placeholder,
    form,
    missingMessage,
    validateStatus,
    colon,
    hasFeedback,
    className,
    inputClassName,
    ...other
  } = props;

  const translatedPlaceHolder = placeholder || String.t('InputField.defaultPlaceholder');
  const translatedMissingMessage = missingMessage || String.t('InputField.errNoText');

  const customInput = BaseInput({
    ...other,
    form,
    componentKey,
    initialValue,
    placeholder: translatedPlaceHolder,
    required,
    extraRules,
    missingMessage: translatedMissingMessage,
    className: inputClassName
  });

  return (
    <FormItem
      labelCol={layout.labelCol}
      wrapperCol={layout.wrapperCol}
      label={label}
      hasFeedback={hasFeedback}
      required={required}
      colon={colon}
      validateStatus={validateStatus}
      className={className}
    >
      {customInput}
    </FormItem>
  );
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
