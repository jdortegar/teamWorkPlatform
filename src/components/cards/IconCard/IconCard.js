import React from 'react';
import PropTypes from 'prop-types';
import SimpleCard from '../SimpleCard';

const propTypes = {
  text: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  extra: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

const defaultProps = {
  icon: '',
  extra: null,
  text: null
};

function IconCard(props) {
  const { extra, icon, text, ...rest } = props;
  return (
    <SimpleCard extra={extra} {...rest}>
      <div>
        { icon }
        <h4>{text}</h4>
      </div>
    </SimpleCard>
  );
}

IconCard.propTypes = propTypes;
IconCard.defaultProps = defaultProps;

export default IconCard;
