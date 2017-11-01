import React from 'react';
import PropTypes from 'prop-types';
import SimpleCard from '../SimpleCard';

const propTypes = {
  imgSrc: PropTypes.string.isRequired,
  altText: PropTypes.string,
  extra: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

const defaultProps = {
  extra: null,
  altText: ''
};

function ImageCard(props) {
  const { imgSrc, extra, altText, ...rest } = props;
  return (
    <SimpleCard extra={extra} {...rest}>
      <img src={imgSrc} alt={altText} className="img" />
    </SimpleCard>
  );
}

ImageCard.propTypes = propTypes;
ImageCard.defaultProps = defaultProps;

export default ImageCard;
