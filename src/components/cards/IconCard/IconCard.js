import React from 'react';
import PropTypes from 'prop-types';
import SimpleCard from '../SimpleCard';

const propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

const defaultProps = {
  icon: ''
};

function IconCard(props) {
  return (
    <SimpleCard>
      <div>
        { props.icon }
        <h4>{props.text}</h4>
      </div>
    </SimpleCard>
  );
}

IconCard.propTypes = propTypes;
IconCard.defaultProps = defaultProps;

export default IconCard;
