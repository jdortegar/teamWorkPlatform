import React from 'react';
import PropTypes from 'prop-types';
import String from 'translations';
import getInitials from 'utils/helpers';
import Avatar from './Avatar';

const propTypes = {
  size: PropTypes.string.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    preferences: PropTypes.object.isRequired,
    icon: PropTypes.string
  }).isRequired
};

const defaultProps = {
  icon: null
};

function AvatarWrapper(props) {
  const { firstName, lastName, userId, preferences, icon, ...rest } = props.user;
  if (icon) {
    return (<Avatar size={props.size} src={`data:image/jpeg;base64, ${icon}`} />);
  }
  const fullName = String.t('fullName', { firstName, lastName });
  const initials = getInitials(fullName);
  return (
    <Avatar
      size={props.size}
      key={userId}
      color={preferences.iconColor}
      {...rest}
    >
      {initials}
    </Avatar>
  );
}

AvatarWrapper.propTypes = propTypes;
AvatarWrapper.defaultProps = defaultProps;

export default AvatarWrapper;
