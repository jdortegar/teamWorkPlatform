import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Avatar as AntdAvatar } from 'antd';
import './styles/style.css';

const propTypes = {
  ...AntdAvatar.propTypes,
  size: PropTypes.oneOf(['large', 'small', 'default', 'x-large']),
  color: PropTypes.string
};

const defaultProps = {
  size: 'default',
  color: '#5b7eba'
};

const CLASSNAME = 'habla-avatar';

function Avatar(props) {
  const { children, size, color, className: userClassName, ...rest } = props;
  const className = classNames(CLASSNAME, userClassName, `${CLASSNAME}--size-${size}`);

  return (
    <AntdAvatar size={size} className={className} style={{ backgroundColor: color }} {...rest}>
      {children}
    </AntdAvatar>
  );
}

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;
export default Avatar;
