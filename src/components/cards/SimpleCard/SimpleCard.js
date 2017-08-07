import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  bodyStyle: PropTypes.object,
  className: PropTypes.string
};

const defaultProps = {
  bodyStyle: { minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  className: 'simple-card__more-margin'
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
