import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  bodyStyle: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

const defaultProps = {
  bodyStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', wordBreak: 'break-word', padding: '14px' },
  className: 'Simple-card Simple-card--round'
};

function SimpleCard(props) {
  const { children, bodyStyle, className } = props;

  return (
    <Card className={className} bodyStyle={bodyStyle} {...props}>
      {children}
    </Card>
  );
}

SimpleCard.propTypes = propTypes;
SimpleCard.defaultProps = defaultProps;

export default SimpleCard;
