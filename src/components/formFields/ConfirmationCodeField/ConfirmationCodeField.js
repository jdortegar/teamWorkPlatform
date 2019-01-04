import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

import String from 'src/translations';
import BaseInput from '../BaseInput';

const FormItem = Form.Item;

const propTypes = {
  form: PropTypes.object.isRequired,
  validator: PropTypes.func,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  required: PropTypes.bool,
  missingMessage: PropTypes.string
};

const defaultProps = {
  componentKey: 'confirmationCode',
  initialValue: '',
  placeholder: String.t('labelConfirmationCodePlaceholder'),
  label: String.t('labelConfirmationCode'),
  required: false,
  missingMessage: null,
  validator: null,
  layout: {}
};

const ConfirmationCodeField = props => {
  const { layout, label, missingMessage, validator, placeholder, ...rest } = props;

  const translatedMissingMessage = missingMessage || String.t('errConfirmationCodeMissing');
  const decoratedInput = BaseInput({
    ...rest,
    placeholder,
    missingMessage: translatedMissingMessage,
    extraRules: [{ validator }]
  });

  return (
    <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} label={label} hasFeedback>
      {decoratedInput}
    </FormItem>
  );
};

ConfirmationCodeField.propTypes = propTypes;
ConfirmationCodeField.defaultProps = defaultProps;

export default ConfirmationCodeField;
