import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

const defaultProps = {
  className: ''
};

function SimpleCardContainer(props) {
  return <div className={props.className}>{props.children}</div>;
}

SimpleCardContainer.propTypes = propTypes;
SimpleCardContainer.defaultProps = defaultProps;

export default SimpleCardContainer;
