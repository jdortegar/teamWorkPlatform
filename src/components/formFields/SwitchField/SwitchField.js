import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import classNames from 'classnames';
import { formShape } from '../../../propTypes';
import messages from './messages';

const { string, bool } = PropTypes;
const propTypes = {
  form: formShape.isRequired,
  componentKey: string.isRequired,
  valuePropName: string.isRequired,
  initialValue: bool.isRequired,
  checkedChildren: string,
  unCheckedChildren: string
};

const defaultProps = {
  checkedChildren: messages.on,
  unCheckedChildren: messages.off
};

function SwitchField(props) {
  const {
    form,
    componentKey,
    valuePropName,
    className: userClassName,
    initialValue,
    ...rest } = props;

  const decorator = form.getFieldDecorator(componentKey, {
    valuePropName,
    initialValue
  });

  const className = classNames('c-base-switch', userClassName);
  return decorator(<Switch
    {...rest}
    name={componentKey}
    className={className}
  />);
}

SwitchField.propTypes = propTypes;
SwitchField.defaultProps = defaultProps;

export default SwitchField;
