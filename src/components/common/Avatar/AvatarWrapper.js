import React from 'react';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import String from 'translations';
import getInitials from 'utils/helpers';
import Avatar from './Avatar';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.string.isRequired,
  hideStatusTooltip: PropTypes.bool,
  hidePresence: PropTypes.bool,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    preferences: PropTypes.object.isRequired,
    icon: PropTypes.string,
    presenceStatus: PropTypes.string,
    online: PropTypes.bool
  }).isRequired
};

const defaultProps = {
  className: '',
  hidePresence: false,
  hideStatusTooltip: false,
  icon: null,
  online: true
};

class AvatarWrapper extends React.Component {
  renderUserStatus() {
    const { presenceStatus } = this.props.user;
    const { size, hideStatusTooltip } = this.props;
    let tip = String.t('teamMemberPage.activeStatus');
    let className = `habla-top-navigation-avatar-signal habla-avatar-signal-${size}`;
    switch (presenceStatus) {
      case 'online':
      case null:
        tip = String.t('teamMemberPage.statusOnline');
        className += ' habla-color-green';
        // className = null;
        break;
      case 'away':
        tip = String.t('teamMemberPage.statusAway');
        className += ' habla-color-yellow';
        break;
      case 'busy':
        tip = String.t('teamMemberPage.statusBusy');
        className += ' habla-color-red';
        break;
      default:
        tip = presenceStatus;
        break;
    }
    return hideStatusTooltip ? (<div className={className} />) :
      (<Tooltip placement="top" title={tip}>
        <div className={className} />
      </Tooltip>);
  }

  render() {
    const {
      presenceStatus,
      online,
      firstName,
      lastName,
      userId,
      preferences,
      icon
      //  ...rest
    } = this.props.user;
    const { className, hidePresence } = this.props;
    let topClass = (className || '').concat(' habla-top-menu-subitem');
    let lowOpacity = false;
    if (online !== undefined && !online) {
      topClass += ' ';
      lowOpacity = true;
    }

    const fullName = String.t('fullName', { firstName, lastName });
    const initials = getInitials(fullName);
    return (
      <div className={topClass}>
        {!hidePresence && !lowOpacity && this.renderUserStatus(presenceStatus)}
        <div>
          {icon ?
            (<Avatar size={this.props.size} src={`data:image/jpeg;base64, ${icon}`} />) :
            (<Avatar size={this.props.size} key={userId} color={preferences.iconColor}>{initials}</Avatar>)
          }
        </div>
      </div>
    );
  }
}

AvatarWrapper.propTypes = propTypes;
AvatarWrapper.defaultProps = defaultProps;

export default AvatarWrapper;
