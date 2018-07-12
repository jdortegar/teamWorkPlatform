import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  minWidth: PropTypes.string,
  shape: PropTypes.string,
  user: PropTypes.oneOfType([
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      icon: PropTypes.string,
      preferences: PropTypes.shape({
        iconColor: PropTypes.string.isRequired
      }).isRequired
    }),
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      preferences: PropTypes.shape({
        iconColor: PropTypes.string.isRequired
      }).isRequired
    })
  ]).isRequired,
  type: PropTypes.string.isRequired,
  clickable: PropTypes.bool,
  online: PropTypes.bool
};

const defaultProps = {
  width: '35px',
  height: '35px',
  minWidth: '35px',
  shape: 'square',
  clickable: true,
  online: true
};

function UserIcon(props) {
  const className = classNames('user-icon__main-container', `user-icon__main-container--${props.shape}`, {
    'user-icon__main-container--offline': !props.online
  });
  const { preferences, icon } = props.user;
  const { logo } = preferences;
  const style = {
    width: props.width,
    height: props.height,
    minWidth: props.minWidth
  };
  let imageToShow;
  if (!icon && !logo) {
    style.backgroundColor = preferences.iconColor;
  } else {
    imageToShow = icon ? `data:image/png;base64,${icon}` : logo;
  }

  let name;
  let initials;
  if (props.type === 'team') {
    name = props.user.name;
    initials = name.substring(0, 1).toUpperCase();
  } else {
    const { firstName, lastName } = props.user;
    name = `${firstName} ${lastName}`;
    initials = `${firstName.substring(0, 1).toUpperCase()}${lastName.substring(0, 1).toUpperCase()}`;
  }

  return props.clickable ? (
    <div className={className} style={style} title={name}>
      {!icon && !logo ? (
        initials
      ) : (
        <img
          alt={name}
          src={imageToShow}
          style={{
            width: props.width,
            height: props.height,
            minWidth: props.minWidth
          }}
        />
      )}
    </div>
  ) : (
    <div className={className} style={style}>
      {!icon && !logo ? (
        initials
      ) : (
        <img
          alt={name}
          src={imageToShow}
          style={{
            width: props.width,
            height: props.height,
            minWidth: props.minWidth
          }}
        />
      )}
    </div>
  );
}

UserIcon.propTypes = propTypes;
UserIcon.defaultProps = defaultProps;

export default UserIcon;
