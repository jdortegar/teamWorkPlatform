import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Alert } from 'antd';
import './styles/style.css';

const propTypes = {
  ...Alert.propTypes,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  position: PropTypes.oneOf(['topRight', 'topLeft']),
  showIcon: PropTypes.bool,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

const defaultProps = {
  showIcon: true,
  description: null,
  type: 'success',
  position: 'topRight'
};

const CLASSNAME = 'habla-toast';

function Toast(props) {
  const { title, description, showIcon, type, userClassName, position } = props;

  const className = classNames(CLASSNAME, userClassName, `${CLASSNAME}--position-${position}`);

  return (
    <Alert message={title} description={description} showIcon={showIcon} type={type} closable className={className} />
  );
}

Toast.propTypes = propTypes;
Toast.defaultProps = defaultProps;

export default Toast;
