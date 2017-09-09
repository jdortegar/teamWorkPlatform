import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  bodyStyle: PropTypes.object,
  cardClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.string
};

const defaultProps = {
  bodyStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', wordBreak: 'break-word', padding: '14px' },
  cardClassName: 'Simple-card--round',
  size: 'small'
};

function SimpleCard(props) {
  const { children, bodyStyle, cardClassName, size } = props;
  const className = classNames('Simple-card', [cardClassName, `Simple-card--${size}`]);

  return (
    <Card className={className} bodyStyle={bodyStyle} {...props}>
      {children}
    </Card>
  );
}

SimpleCard.propTypes = propTypes;
SimpleCard.defaultProps = defaultProps;

export default SimpleCard;
