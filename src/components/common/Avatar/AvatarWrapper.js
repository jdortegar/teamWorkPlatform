import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip, Popover, Menu, Divider } from 'antd';
import { VideoCallModal } from 'src/containers';
import getInitials from 'src/utils/helpers';
import String from 'src/translations';
import moment from 'moment-timezone';
import Avatar from './Avatar';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.string.isRequired,
  hideStatusTooltip: PropTypes.bool,
  hidePresence: PropTypes.bool,
  currentUser: PropTypes.object,
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    preferences: PropTypes.object.isRequired,
    icon: PropTypes.string,
    presenceStatus: PropTypes.string,
    online: PropTypes.bool
  }).isRequired,
  makePersonalCall: PropTypes.func,
  history: PropTypes.object,
  showDetails: PropTypes.bool
};

const defaultProps = {
  className: '',
  hidePresence: false,
  hideStatusTooltip: false,
  currentUser: null,
  history: null,
  showDetails: true,
  makePersonalCall: null
};

class AvatarWrapper extends React.Component {
  state = {
    videoCallModalVisible: false
  };

  showVideoCallModal = hide => {
    if (hide) {
      return this.setState({
        videoCallModalVisible: false
      });
    }
    return this.setState({
      videoCallModalVisible: !this.state.videoCallModalVisible
    });
  };

  handleVideoCall = (e, callerId, calledId) => {
    e.stopPropagation();
    this.setState({
      videoCallModalVisible: true
    });
    this.props.makePersonalCall(callerId, calledId);
  };

  renderContent = () => {
    const { currentUser, user } = this.props;
    const { userId, online } = user;
    return (
      <div>
        <div className="Subscriber__Tooltip_Header">
          <div className="Subscriber__Tooltip_MainInfo">
            <AvatarWrapper size="default" user={user} hideStatusTooltip showDetails={false} />
            <div className="Subscriber__Tooltip_Text">
              <span className="Subscriber__Tooltip_Name">{user.fullName}</span>
              <span className="Subscriber__Tooltip_Status habla-soft-grey">
                {user.preferences.customPresenceStatusMessage}
              </span>
            </div>
          </div>
          <Divider style={{ margin: '10px auto 5px', background: '#7d7d7d' }} />
          <div className="Subscriber__Tooltip_ExtraInfo">
            <span className="Subscriber__Tooltip_DisplayName habla-soft-grey">{user.displayName}</span>
            <span className="Subscriber__Tooltip_TimeZone habla-soft-grey">
              {moment()
                .tz(user.timeZone)
                .format('HH:mm')}{' '}
              {String.t('sideBar.localTime')}
            </span>
            <span className="Subscriber__Tooltip_EMail habla-soft-grey">{user.email}</span>
          </div>
        </div>

        <Menu mode="vertical" className="pageHeaderMenu">
          {userId !== user.userId && (
            <Menu.Item key={`${user.userId}-chat`}>
              <span
                onClick={() => {
                  this.props.history.push(`/app/chat/${userId}`);
                }}
              >
                <i className="fas fa-comment" /> {String.t('sideBar.directMessage')}
              </span>
            </Menu.Item>
          )}
          {userId !== currentUser.userId && online && user.presenceStatus !== 'busy' && (
            <Menu.Item key={user.userId}>
              <span onClick={e => this.handleVideoCall(e, currentUser.userId, user.userId)}>
                <i className="fa fa-phone" /> {String.t('sideBar.videoCall')}
              </span>
            </Menu.Item>
          )}
          <Menu.Item key={`${userId}-profile`}>
            <span
              onClick={e => {
                e.stopPropagation();
                this.props.history.push(`/app/teamMember/${userId}`);
              }}
            >
              <i className="fas fa-user" /> {String.t('sideBar.userProfile')}
            </span>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  renderUserStatus() {
    const { user, size, hideStatusTooltip } = this.props;
    const { presenceStatus } = user;
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
    return hideStatusTooltip ? (
      <div className={className} />
    ) : (
      <Tooltip placement="top" title={tip}>
        <div className={className} />
      </Tooltip>
    );
  }

  render() {
    const { className, hidePresence, user, showDetails } = this.props;
    if (!user) return null;

    const { presenceStatus, online, firstName, lastName, userId, preferences = {}, icon } = user;
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
          {showDetails ? (
            <Popover key={userId} placement="topLeft" content={this.renderContent()} trigger="hover">
              <span>
                {icon ? (
                  <Avatar size={this.props.size} src={`data:image/jpeg;base64, ${icon}`} />
                ) : (
                  <Avatar size={this.props.size} key={userId} color={preferences.iconColor}>
                    {initials}
                  </Avatar>
                )}
              </span>
            </Popover>
          ) : (
            <span>
              {icon ? (
                <Avatar size={this.props.size} src={`data:image/jpeg;base64, ${icon}`} />
              ) : (
                <Avatar size={this.props.size} key={userId} color={preferences.iconColor}>
                  {initials}
                </Avatar>
              )}
            </span>
          )}
        </div>
        <VideoCallModal visible={this.state.videoCallModalVisible} showModal={this.showVideoCallModal} user={user} />
      </div>
    );
  }
}

AvatarWrapper.propTypes = propTypes;
AvatarWrapper.defaultProps = defaultProps;

export default AvatarWrapper;
