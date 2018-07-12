import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { antValidate, lastName } from '../../../validations';
import BaseInput from '../BaseInput';
import String from '../../../translations';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string,
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
  label: String.t('labelLastName')
};

function LastNameField(props) {
  const { layout, label, missingMessage, placeholder, ...rest } = props;

  const translatedPlaceHolder = placeholder || String.t('labelLastNamePlaceholder');
  const translatedMissingMessage = missingMessage || String.t('errLastNameMissing');
  const decoratedInput = BaseInput({
    ...rest,
    placeholder: translatedPlaceHolder,
    missingMessage: translatedMissingMessage,
    extraRules: [{ validator: antValidate(lastName) }]
  });

  return (
    <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} label={label} hasFeedback>
      {decoratedInput}
    </FormItem>
  );
}

LastNameField.propTypes = propTypes;
LastNameField.defaultProps = defaultProps;

export default LastNameField;
