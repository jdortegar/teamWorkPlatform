import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { formShape } from '../../../propTypes';
import { antValidate, email } from '../../../validations';
import BaseInput from '../BaseInput';
import String from '../../../translations';

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
  inputClassName: PropTypes.string,
  noLabel: PropTypes.bool
};

const defaultProps = {
  componentKey: 'email',
  initialValue: null,
  label: String.t('labelEmail'),
  required: false,
  missingMessage: null,
  placeholder: null,
  layout: {},
  inputClassName: null,
  noLabel: false
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
    inputClassName,
    noLabel,
    ...other
  } = props;

  const translatedMissingMessage = missingMessage || String.t('errEmailMissing');
  const translatedPlaceHolder = placeholder || String.t('labelEmailPlaceholder');

  const decoratedInput = BaseInput({
    ...other,
    form,
    componentKey,
    initialValue,
    placeholder: translatedPlaceHolder,
    required,
    extraRules: [{ validator: antValidate(email) }],
    className: inputClassName,
    missingMessage: translatedMissingMessage
  });

  if (noLabel) {
    return (
      <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} hasFeedback required={required}>
        {decoratedInput}
      </FormItem>
    );
  }
  return (
    <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} label={label} hasFeedback required={required}>
      {decoratedInput}
    </FormItem>
  );
}

EmailField.propTypes = propTypes;
EmailField.defaultProps = defaultProps;

export default EmailField;
