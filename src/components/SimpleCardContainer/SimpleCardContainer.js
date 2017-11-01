import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

function SimpleCardContainer(props) {
  return (
    <div className={props.className}>
      {props.children}
    </div>
  );
}

SimpleCardContainer.propTypes = propTypes;

export default SimpleCardContainer;
