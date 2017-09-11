import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  bodyStyle: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.string
};

const defaultProps = {
  bodyStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', wordBreak: 'break-word', padding: '14px' },
  className: 'Simple-card--round',
  size: 'small'
};

function SimpleCard(props) {
  const { children, bodyStyle, className, size } = props;
  const cardClassName = classNames('Simple-card', [className, `Simple-card--${size}`]);

  return (
    <Card {...props} className={cardClassName} bodyStyle={bodyStyle}>
      {children}
    </Card>
  );
}

SimpleCard.propTypes = propTypes;
SimpleCard.defaultProps = defaultProps;

export default SimpleCard;
