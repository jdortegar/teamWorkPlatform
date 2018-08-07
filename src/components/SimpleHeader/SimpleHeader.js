import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  type: PropTypes.string
};

const defaultProps = {
  type: 'text'
};

function SimpleHeader(props) {
  return (
    <div className="SimpleHeader-block SimpleHeader__container padding-class-a">
      {props.type === 'text' ? <h2>{props.text}</h2> : props.text}
    </div>
  );
}

SimpleHeader.propTypes = propTypes;
SimpleHeader.defaultProps = defaultProps;

export default SimpleHeader;
