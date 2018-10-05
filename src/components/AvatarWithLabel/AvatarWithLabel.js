import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Avatar from 'src/components/common/Avatar';
import getInitials from 'src/utils/helpers';

const propTypes = {
  item: PropTypes.object,
  enabled: PropTypes.bool
};
const defaultProps = {
  item: {
    name: 'Default Label'
  },
  enabled: false
};

const AvatarWithLabel = ({ item, enabled }) => {
  const { preferences, editUrl } = item;
  const className = classNames({
    'opacity-low': !enabled
  });
  if (preferences.logo && editUrl) {
    return (
      <div className="avatar-label-container">
        <Link to={editUrl || '#'}>
          <Avatar color={preferences.iconColor}>
            <i className={preferences.logo} />
          </Avatar>
        </Link>
        <span className="habla-avatar-label">{item.name}</span>
      </div>
    );
  }
  if (preferences.logo) {
    return (
      <div className="avatar-label-container">
        <Avatar color={preferences.iconColor} className={className}>
          <i className={preferences.logo} />
        </Avatar>
        <span className="habla-avatar-label">{item.name}</span>
      </div>
    );
  }
  if (preferences.avatarBase64) {
    return (
      <div className="avatar-label-container">
        <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} />
        <span className="habla-avatar-label">{item.name}</span>
      </div>
    );
  }

  // Get One initial for team and two for name
  let nameInitial;
  if (item.name) {
    nameInitial = item.name.substring(0, 1).toUpperCase();
  } else if (item.fullName) {
    nameInitial = getInitials(item.fullName);
  }

  return (
    <div className="avatar-label-container">
      <Avatar color={preferences.iconColor} className={className}>
        {nameInitial}
      </Avatar>
      <span className="habla-avatar-label">{item.name ? item.name : item.fullName}</span>
    </div>
  );
};

AvatarWithLabel.propTypes = propTypes;
AvatarWithLabel.defaultProps = defaultProps;

export default AvatarWithLabel;
