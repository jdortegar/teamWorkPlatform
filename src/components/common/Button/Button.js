import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button as AntdButton } from 'antd';
import './styles/style.css';

const propTypes = {
  ...AntdButton.propTypes,
  type: PropTypes.oneOf(['main', 'secondary', 'alert', 'disable']),
  /**
   * Fit the width to the text of the button
   */
  fitText: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'default'])
};

const defaultProps = {
  type: 'secondary',
  size: 'default',
  disabled: false,
  fitText: false
};

const CLASSNAME = 'habla-button';

function Button(props) {
  const { children, fitText, type, size, disabled, className: userClassName, ...rest } = props;

  const className = classNames(CLASSNAME, userClassName, `${CLASSNAME}--type-${type}`, {
    [`${CLASSNAME}--size-${size}`]: !fitText
  });

  return (
    <AntdButton className={className} size={size} type={type} disabled={disabled} {...rest}>
      {children}
    </AntdButton>
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
Button.Group = AntdButton.Group;
export default Button;
