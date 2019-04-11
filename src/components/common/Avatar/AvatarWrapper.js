import React from 'react';
import PropTypes from 'prop-types';

import { Popover, Menu, Divider } from 'antd';
import { VideoCallModal, ShareModal } from 'src/containers';
import getInitials from 'src/utils/helpers';
import String from 'src/translations';
import moment from 'moment-timezone';
import Avatar from './Avatar';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
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
  showDetails: PropTypes.bool,
  orgLength: PropTypes.number
};

const defaultProps = {
  size: 'default',
  className: '',
  hidePresence: false,
  history: null,
  showDetails: true,
  makePersonalCall: null,
  orgLength: null,
  currentUser: null
};

class AvatarWrapper extends React.Component {
  state = {
    videoCallModalVisible: false,
    shareModalVisible: false,
    sharePT: false
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

  handleShareProfile = sharePT => {
    this.setState({ shareModalVisible: true, sharePT });
  };

  showShareModal = () => {
    this.setState({
      shareModalVisible: !this.state.shareModalVisible
    });
  };

  renderContent = () => {
    const { currentUser, user, orgLength } = this.props;
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
            <span className="Subscriber__Tooltip_EMail habla-soft-grey">
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </span>
          </div>
        </div>

        <Menu mode="vertical" className="pageHeaderMenu">
          {userId !== user.userId && (
            <Menu.Item key={`${user.userId}-chat`}>
              <span onClick={() => this.props.history.push(`/app/chat/${userId}`)}>
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
            <span onClick={() => this.props.history.push(`/app/teamMember/${userId}`)}>
              <i className="fas fa-address-card" /> {String.t('sideBar.userProfile')}
            </span>
          </Menu.Item>
          {orgLength > 1 && (
            <Menu.Item key={`${userId}-share-user`}>
              <span onClick={() => this.handleShareProfile(false)}>
                <i className="fas fa-user" /> {String.t('sideBar.shareProfileUsers')}
              </span>
            </Menu.Item>
          )}
          {orgLength > 1 && (
            <Menu.Item key={`${userId}-share-team`}>
              <span onClick={() => this.handleShareProfile(true)}>
                <i className="fas fa-users" /> {String.t('sideBar.shareProfilePT')}
              </span>
            </Menu.Item>
          )}
        </Menu>
      </div>
    );
  };

  renderUserStatus() {
    const { user, size } = this.props;
    const { presenceStatus } = user;
    let className = `habla-top-navigation-avatar-signal habla-avatar-signal-${size}`;
    switch (presenceStatus) {
      case 'online':
      case null:
        className += ' habla-color-green';
        // className = null;
        break;
      case 'away':
        className += ' habla-color-yellow';
        break;
      case 'busy':
        className += ' habla-color-red';
        break;
      default:
        break;
    }
    return <div className={className} />;
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
    const dataforShare = { content: [{ text: user.userId, type: 'userId' }], level: 0 };

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
        {this.state.videoCallModalVisible && (
          <VideoCallModal visible={this.state.videoCallModalVisible} showModal={this.showVideoCallModal} user={user} />
        )}
        {this.state.shareModalVisible && (
          <ShareModal
            visible={this.state.shareModalVisible}
            showShareModal={this.showShareModal}
            dataforShare={dataforShare}
            sharePT={this.state.sharePT}
          />
        )}
      </div>
    );
  }
}

AvatarWrapper.propTypes = propTypes;
AvatarWrapper.defaultProps = defaultProps;

export default AvatarWrapper;
