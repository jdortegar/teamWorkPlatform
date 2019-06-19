import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, some, values } from 'lodash';

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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    userId: PropTypes.string,
    preferences: PropTypes.object,
    icon: PropTypes.string,
    presenceStatus: PropTypes.string,
    online: PropTypes.bool
  }),
  makePersonalCall: PropTypes.func,
  history: PropTypes.object,
  showDetails: PropTypes.bool,
  orgLength: PropTypes.number,
  wrapMention: PropTypes.bool,
  usersPresences: PropTypes.object
};

const defaultProps = {
  size: 'default',
  className: '',
  hidePresence: false,
  history: null,
  showDetails: true,
  makePersonalCall: null,
  orgLength: 1,
  currentUser: null,
  wrapMention: false,
  user: {
    firstName: 'Unknown',
    lastName: 'User',
    userId: null,
    preferences: null,
    icon: null,
    presenceStatus: null,
    online: null
  },
  usersPresences: {}
};

class AvatarWrapper extends React.Component {
  constructor(props) {
    super(props);

    const { user, usersPresences } = props;

    this.state = {
      videoCallModalVisible: false,
      shareModalVisible: false,
      sharePT: false,
      userData: {
        ...user,
        online: some(values(usersPresences[user.userId]), { presenceStatus: 'online' })
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { user, usersPresences } = nextProps;
    // Update org Users if change some property
    if (usersPresences !== this.props.usersPresences || user !== this.props.user) {
      this.setState({
        userData: {
          ...user,
          online: some(values(usersPresences[user.userId]), { presenceStatus: 'online' })
        }
      });
    }
  }

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
    const { currentUser, orgLength } = this.props;
    const { userData } = this.state;
    const { userId, online } = userData;

    return (
      <div>
        <div className="Subscriber__Tooltip_Header">
          <div className="Subscriber__Tooltip_MainInfo">
            <AvatarWrapper size="default" user={userData} hideStatusTooltip showDetails={false} />
            <div className="Subscriber__Tooltip_Text">
              <span className="Subscriber__Tooltip_Name">{userData.fullName}</span>
              <span className="Subscriber__Tooltip_Status habla-soft-grey">
                {userData.preferences.customPresenceStatusMessage}
              </span>
            </div>
          </div>
          <Divider style={{ margin: '10px auto 5px', background: '#7d7d7d' }} />
          <div className="Subscriber__Tooltip_ExtraInfo">
            <span className="Subscriber__Tooltip_DisplayName habla-soft-grey">{userData.displayName}</span>
            <span className="Subscriber__Tooltip_TimeZone habla-soft-grey">
              {moment()
                .tz(userData.timeZone)
                .format('HH:mm')}{' '}
              {String.t('sideBar.localTime')}
            </span>
            <span className="Subscriber__Tooltip_EMail habla-soft-grey">
              <a target="_blank" rel="noopener noreferrer" href={`mailto:${userData.email}`}>
                {userData.email}
              </a>
            </span>
          </div>
        </div>

        <Menu mode="vertical" className="pageHeaderMenu">
          {userId !== userData.userId && (
            <Menu.Item key={`${userData.userId}-chat`}>
              <span onClick={() => this.props.history.push(`/app/chat/${userId}`)}>
                <i className="fas fa-comment" /> {String.t('sideBar.directMessage')}
              </span>
            </Menu.Item>
          )}
          {userId !== currentUser.userId && online && userData.presenceStatus !== 'busy' && (
            <Menu.Item key={userData.userId}>
              <span onClick={e => this.handleVideoCall(e, currentUser.userId, userData.userId)}>
                <i className="fa fa-phone" /> {String.t('sideBar.videoCall')}
              </span>
            </Menu.Item>
          )}
          <Menu.Item key={`${userId}-profile`}>
            <span onClick={() => this.props.history.push(`/app/teamMember/${userId}`)}>
              <i className="fas fa-address-card" /> {String.t('sideBar.userProfile')}
            </span>
          </Menu.Item>
          {orgLength >= 1 && (
            <Menu.Item key={`${userId}-share-user`}>
              <span onClick={() => this.handleShareProfile(false)}>
                <i className="fas fa-user" /> {String.t('sideBar.shareProfileUsers')}
              </span>
            </Menu.Item>
          )}
          {orgLength >= 1 && (
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
    const { size } = this.props;
    const { userData } = this.state;
    const { presenceStatus, online } = userData;
    let className = `habla-top-navigation-avatar-signal habla-avatar-signal-${size}`;
    if (!online) return false;
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
    const { className, hidePresence, showDetails, wrapMention } = this.props;
    const { userData } = this.state;
    if (!userData || !userData.userId || isEmpty(userData)) return null;

    const { presenceStatus, online, firstName, lastName, userId, preferences = {}, icon } = userData;
    let topClass = (className || '').concat(' habla-top-menu-subitem');
    let lowOpacity = false;
    if (online !== undefined && !online) {
      topClass += ' ';
      lowOpacity = true;
    }

    const fullName = String.t('fullName', { firstName, lastName });
    const initials = getInitials(fullName);
    const dataforShare = {
      content: [{ text: userData.userId, type: 'userId' }],
      level: 0,
      appData: { userId: userData.userId }
    };

    return (
      <div className={topClass}>
        {wrapMention ? (
          <Popover key={userId} placement="topLeft" content={this.renderContent()} trigger="hover">
            <span className="Mention__UserFullName">{`@${fullName}`}</span>
          </Popover>
        ) : (
          <div>
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
          </div>
        )}
        {this.state.videoCallModalVisible && (
          <VideoCallModal
            visible={this.state.videoCallModalVisible}
            showModal={this.showVideoCallModal}
            user={userData}
          />
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
