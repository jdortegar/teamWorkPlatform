import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  iconColor: PropTypes.string.isRequired,
  image: PropTypes.string,
  user: PropTypes.object,
  isUser: PropTypes.bool,
  name: PropTypes.string.isRequired,
  styles: PropTypes.object
};
const defaultProps = {
  image: null,
  isUser: false,
  user: null,
  styles: null
};

const getFirstLetter = (name, isUser, user) => {
  let firstLetter;
  if (isUser) {
    const { firstName, lastName } = user;
    firstLetter = `${firstName.substring(0, 1).toUpperCase()}${lastName.substring(0, 1).toUpperCase()}`;
  } else {
    firstLetter = name.substring(0, 1).toUpperCase();
  }
  return firstLetter;
};

const Avatar = ({ image, iconColor, name, isUser, user, ...props }) => {
  const className = classNames('user-icon__main-container', 'user-icon__main-container--square');
  const newStyles = props.styles || {};
  let firstLetter;
  let imageToShow;
  if (!image) {
    newStyles.backgroundColor = iconColor;
    firstLetter = getFirstLetter(name, isUser, user);
  } else {
    imageToShow = image.indexOf('https://www.google.com/') > -1 ? image : `data:image/png;base64,${image}`;
  }

  return (
    <div className={className} style={newStyles}>
      {!image ? firstLetter : <img alt={name} src={imageToShow} style={newStyles} />}
    </div>
  );
};

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;
