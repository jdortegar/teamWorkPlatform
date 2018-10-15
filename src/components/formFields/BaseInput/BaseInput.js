import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import classNames from 'classnames';
import { formShape } from 'src/propTypes';

const { string, array, bool, node, oneOfType } = PropTypes;
const propTypes = {
  form: formShape.isRequired,
  componentKey: string.isRequired,
  initialValue: string,
  extraRules: array,
  placeholder: oneOfType([string, node]),
  missingMessage: string.isRequired,
  required: bool
};

const defaultProps = {
  initialValue: null,
  extraRules: [],
  placeholder: null,
  required: false
};

function BaseInput(props) {
  const {
    form,
    componentKey,
    initialValue,
    missingMessage,
    extraRules = [],
    type = 'text',
    required,
    className: userClassName,
    placeholder,
    ...rest
  } = props;

  const rules = [
    {
      required,
      message: missingMessage,
      whitespace: true
      // transform: (value) => { return value.trim(); } // this does not work!
    },
    ...extraRules
  ];

  const decorator = form.getFieldDecorator(componentKey, {
    initialValue,
    validateTrigger: ['onChange'],
    validateFirst: true,
    rules
  });

  const className = classNames('c-base-input', userClassName);

  return decorator(<Input {...rest} type={type} name={componentKey} className={className} placeholder={placeholder} />);
}

BaseInput.defaultProps = defaultProps;
BaseInput.propTypes = propTypes;

export default BaseInput;
