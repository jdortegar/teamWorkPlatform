import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

import String from 'src/translations';
import { antValidate, firstName } from 'src/validations';
import BaseInput from '../BaseInput';

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
  componentKey: 'firstName',
  initialValue: '',
  placeholder: String.t('labelFirstNamePlaceholder'),
  required: false,
  missingMessage: null,
  layout: {},
  label: String.t('labelFirstName')
};

function FirstNameField(props) {
  const { layout, label, missingMessage, placeholder, ...rest } = props;

  const translatedMissingMessage = missingMessage || String.t('errFirstNameMissing');
  const decoratedInput = BaseInput({
    ...rest,
    placeholder,
    missingMessage: translatedMissingMessage,
    extraRules: [{ validator: antValidate(firstName) }]
  });

  return (
    <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} label={label} hasFeedback>
      {decoratedInput}
    </FormItem>
  );
}

FirstNameField.propTypes = propTypes;
FirstNameField.defaultProps = defaultProps;

export default FirstNameField;
