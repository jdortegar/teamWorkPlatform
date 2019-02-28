import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { paths } from 'src/routes';
import { Layout, Menu, Tooltip, Dropdown, Input, Icon, Popover, message } from 'antd';
import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { AvatarWrapper, Badge } from 'src/components';
import { VideoCallModal } from 'src/containers';
import Avatar from '../common/Avatar';
import './styles/style.css';

const { Sider } = Layout;

const propTypes = {
  user: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.array,
  subscribers: PropTypes.array,
  subscribersPresences: PropTypes.object,
  teams: PropTypes.array,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.object
  }).isRequired,
  location: PropTypes.object.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  sideBarIsHidden: PropTypes.bool.isRequired,
  showSideBar: PropTypes.func.isRequired,
  currentSubscriberOrgId: PropTypes.string,
  userRoles: PropTypes.object,
  teamId: PropTypes.string,
  makePersonalCall: PropTypes.func,
  callingData: PropTypes.object,
  finishCall: PropTypes.func.isRequired,
  personalConversationUnreadMessages: PropTypes.number,
  readMessagesByConversationId: PropTypes.object,
  conversationIdsByTeamId: PropTypes.object
};

const defaultProps = {
  currentSubscriberOrgId: null,
  subscriberOrgs: [],
  subscribers: [],
  subscribersPresences: {},
  teams: [],
  userRoles: {},
  teamId: null,
  makePersonalCall: null,
  callingData: {},
  personalConversationUnreadMessages: null,
  readMessagesByConversationId: {},
  conversationIdsByTeamId: {}
};

const ROUTERS_TO_HIDE_SIDEBAR = ['/app/userDetails'];

function renderAvatar(item, enabled) {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': !enabled
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} />;
  }
  const nameInitial = item.name.substring(0, 1).toUpperCase();
  return (
    <Avatar color={preferences.iconColor} className={className}>
      {nameInitial}
    </Avatar>
  );
}

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.orgsOpen = {};
    const { teams, currentSubscriberOrgId } = this.props;
    const teamsActive = teams.filter(team => team.subscriberOrgId === currentSubscriberOrgId && team.active);

    this.teamsActive = teamsActive;

    this.state = {
      teamsOpenKeys: [],
      teamsActive,
      videoCallModalVisible: false,
      videoCallUser: {},
      videoCallReceived: null
    };

    this.goToOrgPage = this.goToOrgPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillMount() {
    const { location, sideBarIsHidden } = this.props;
    if (sideBarIsHidden && !ROUTERS_TO_HIDE_SIDEBAR.includes(location.pathname)) {
      this.props.showSideBar();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentSubscriberOrgId, teams, callingData, subscribers, user } = nextProps;
    if (currentSubscriberOrgId !== this.props.currentSubscriberOrgId || !_.isEqual(teams, this.props.teams)) {
      const teamsActive = nextProps.teams.filter(
        team => team.subscriberOrgId === currentSubscriberOrgId && team.active
      );
      this.teamsActive = teamsActive;
      this.setState({ teamsActive });
    }
    if (callingData.callerId && callingData.status !== 'cancelled') {
      const videoCallUser = Object.values(subscribers).find(subscriber => subscriber.userId === callingData.callerId);
      this.setState({
        videoCallModalVisible: true,
        videoCallUser,
        videoCallReceived: true
      });
    }
    if (callingData.status === 'accepted') {
      const { callerId, teamId } = this.props.callingData;
      let userUrl;
      if (callerId && teamId) {
        userUrl = teamId;
      } else {
        userUrl = user.userId;
      }
      userUrl = userUrl.substring(0, userUrl.indexOf('-'));
      const newTab = window.open(
        `https://meet.habla.ai/${userUrl}`,
        'Habla Video Call',
        'toolbar=no, menubar=no, resizable=yes, location=no, titlebar=no, directories=no,'
      );

      if (newTab) {
        newTab.location.href = `https://meet.habla.ai/${userUrl}`;
      } else {
        message.success(String.t('sidebar.allowPopUp'));
      }
    }

    if (callingData.status === 'cancelled' && !callingData.callerId) {
      setTimeout(() => {
        this.props.finishCall();
        this.setState({
          videoCallModalVisible: false
        });
      }, 2000);
    }
  }

  getTeamsIds(orgId) {
    const teams = this.props.teams.filter(team => team.subscriberOrgId === orgId);
    return teams.map(team => team.teamId);
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

  cancelClickEvent(e = window.event) {
    this.e = e;
    this.e.cancelBubble = true;
    if (this.e.stopPropagation) this.e.stopPropagation();
  }

  toogleTeams(teamId) {
    const { teamsOpenKeys } = this.state;
    const teamIdFound = teamsOpenKeys.find(teamIdKey => teamIdKey === teamId);

    if (teamIdFound) {
      const index = teamsOpenKeys.indexOf(teamIdFound);
      teamsOpenKeys.splice(index, 1);
      this.setState({ teamsOpenKeys });
    } else {
      this.setState({
        teamsOpenKeys: [...teamsOpenKeys, teamId]
      });
    }
  }

  handleSearch(e) {
    const { value } = e.target;
    if (value === '') {
      this.setState({ teamsActive: this.teamsActive });
    } else {
      const filteredTeams = this.state.teamsActive.filter(el =>
        el.name.toLowerCase().includes(value.toLowerCase().trim())
      );
      this.setState({ teamsActive: filteredTeams });
    }
  }

  goToTeamPage(e, team) {
    this.props.history.push(`/app/team/${team.teamId}`);
    this.cancelClickEvent(e);
  }

  toogleOrgs(orgId) {
    const teamIds = this.getTeamsIds(orgId);

    if (this.orgsOpen[orgId]) {
      this.setState({ teamsOpenKeys: [...this.state.teamsOpenKeys] });
    } else {
      /* FIRST TIME USER CLICK ON A ORGANIZATION */
      this.orgsOpen[orgId] = true;
      this.setState({ teamsOpenKeys: [...this.state.teamsOpenKeys, ...teamIds] });
    }
  }

  goToOrgPage(e, orgId) {
    const teamIds = this.getTeamsIds(orgId);

    if (this.orgsOpen[orgId]) {
      this.setState({ teamsOpenKeys: [...this.state.teamsOpenKeys] });
    } else {
      /* FIRST TIME USER CLICK ON A ORGANIZATION */
      this.orgsOpen[orgId] = true;
      this.setState({ teamsOpenKeys: [...this.state.teamsOpenKeys, ...teamIds] });
    }

    this.props.setCurrentSubscriberOrgId(orgId);
    this.props.history.push(`/app/organization/${orgId}`);
  }

  renderTeams(teamsActive) {
    const { user, history, readMessagesByConversationId, conversationIdsByTeamId } = this.props;
    if (teamsActive.length === 0) {
      return null;
    }

    let teamsByOrgId = teamsActive.sort(sortByName);

    teamsByOrgId = teamsByOrgId.length === 0 && teamsByOrgId[0] === undefined ? [] : primaryAtTop(teamsByOrgId);

    return teamsByOrgId.map(team => {
      let isAdmin = false;
      if (team.teamMembers) {
        const teamMemberFoundByUser = _.find(team.teamMembers, { userId: user.userId });
        isAdmin = teamMemberFoundByUser.teams[team.teamId].role === 'admin';
      }
      if (!isAdmin && (!team.active || team.deleted)) {
        return null;
      }
      const isTeamOpen = _.includes(this.state.teamsOpenKeys, team.teamId);
      let unreadMessagesCount = 0;
      const conversationId = conversationIdsByTeamId[team.teamId] ? conversationIdsByTeamId[team.teamId][0] : null;
      if (conversationId) {
        const readMessages = readMessagesByConversationId[conversationId] || {};
        unreadMessagesCount = readMessages.messageCount - (readMessages.lastReadMessageCount || 0);
      }
      const teamActive = classNames({ Team_active: history.location.pathname.indexOf(team.teamId) > 1 });

      return (
        <Menu.Item key={team.teamId} className={teamActive}>
          <div className="habla-left-navigation-team-list" onClick={e => this.goToTeamPage(e, team)}>
            <div className="habla-left-navigation-team-list-item padding-class-a">
              <div className="habla-left-navigation-team-list-item">
                <div className="float-left-class">{renderAvatar(team, team.active)}</div>
                <span className="habla-left-navigation-item-label">{team.name}</span>
                <div className="clear" />
              </div>
              <Badge count={isTeamOpen ? 0 : unreadMessagesCount} className="SideBar__Badge" />
            </div>
          </div>
        </Menu.Item>
      );
    });
  }

  renderOrg(org) {
    const { currentSubscriberOrgId } = this.props;
    const className =
      org.subscriberOrgId === currentSubscriberOrgId ? 'subscriberorg-name-current' : 'subscriberorg-name';
    return (
      <a
        className="habla-top-menu-settings"
        key={org.subscriberOrgId}
        onClick={e => {
          this.goToOrgPage(e, org.subscriberOrgId);
        }}
      >
        {renderAvatar(org, true)}
        <span className={className}>{org.name}</span>
      </a>
    );
  }

  renderOrgs() {
    const { subscriberOrgs } = this.props;
    return (
      <Menu className="organizationList">
        <Menu.Item key="orgsHeader">
          <div className="habla-label padding-class-a">{String.t('sideBar.organizationsLabel')}</div>
        </Menu.Item>
        <Menu.Item key="organizationList">{subscriberOrgs.map(org => this.renderOrg(org))}</Menu.Item>
      </Menu>
    );
  }

  renderToolTip() {
    const { userRoles } = this.props;
    if (userRoles && (userRoles.admin || userRoles.teamOwner.length > 0)) {
      return 'iconSettingsTooltipAdmin';
    } else if (userRoles.teamOwner.length > 0) {
      return 'iconSettingsTooltipTeamOwner';
    }
    return 'iconSettingsTooltipUser';
  }

  renderSubscriberAvatar(subscriber) {
    const { userId, online } = subscriber;
    const { user } = this.props;
    const content = (
      <div>
        <div className="Subscriber__Tooltip_Header">
          <AvatarWrapper size="large" user={subscriber} className="mr-05 mb-05" hideStatusTooltip />
          <div className="Subscriber__Tooltip_Text">
            <span className="Subscriber__Tooltip_Name">{subscriber.fullName}</span>
            <span className="Subscriber__Tooltip_Status">{user.preferences.customPresenceStatusMessage}</span>
            <span className="Subscriber__Tooltip_DisplayName">{subscriber.displayName}</span>
            <span className="Subscriber__Tooltip_TimeZone">
              {moment()
                .tz(subscriber.timeZone)
                .format('HH:mm')}{' '}
              {String.t('sideBar.localTime')}
            </span>
            <span className="Subscriber__Tooltip_EMail">{subscriber.email}</span>
          </div>
        </div>

        <Menu mode="vertical" className="pageHeaderMenu">
          {userId !== user.userId && (
            <Menu.Item key={`${subscriber.userId}-chat`}>
              <span
                onClick={() => {
                  this.props.history.push(`/app/chat/${userId}`);
                }}
              >
                <i className="fas fa-comment" /> {String.t('sideBar.directMessage')}
              </span>
            </Menu.Item>
          )}
          {userId !== user.userId && online && subscriber.presenceStatus !== 'busy' && (
            <Menu.Item key={subscriber.userId}>
              <span
                onClick={() => {
                  this.setState({
                    videoCallUser: subscriber,
                    videoCallModalVisible: true,
                    videoCallReceived: false
                  });

                  this.props.makePersonalCall(user.userId, subscriber.userId);
                }}
              >
                <i className="fa fa-phone" /> {String.t('sideBar.videoCall')}
              </span>
            </Menu.Item>
          )}
          <Menu.Item key={`${userId}-profile`}>
            <Link to={`/app/teamMember/${userId}`}>
              <i className="fas fa-user" /> {String.t('sideBar.userProfile')}
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    );

    return (
      <Popover key={userId} placement="topLeft" content={content} trigger="hover">
        <span>
          <AvatarWrapper size="default" user={subscriber} className="mr-05 mb-05" hideStatusTooltip />
        </span>
      </Popover>
    );
  }

  render() {
    const {
      teams,
      subscriberOrgs,
      subscribers,
      subscribersPresences,
      sideBarIsHidden,
      currentSubscriberOrgId,
      history,
      userRoles,
      teamId
    } = this.props;
    if (!currentSubscriberOrgId || !teams || subscriberOrgs.length === 0 || !subscribers || !subscribersPresences) {
      return null;
    }
    const sideClass = classNames({
      Sidebar: true,
      hidden: sideBarIsHidden
    });

    // Set Active Page
    const currenthPath = history.location.pathname;

    const activeHome = classNames({
      active: currenthPath.indexOf(`${paths.team.split('app/')[1].split('/')[0]}/`) > 1
    });
    const activeCKG = classNames({
      active: currenthPath.indexOf(paths.ckg.split('app/')[1].split('/')[0]) > 1
    });
    const activeNotification = classNames({
      active: currenthPath.indexOf(paths.notifications.split('app/')[1].split('/')[0]) > 1
    });
    const activeBookmarks = classNames({
      active: currenthPath.indexOf(paths.bookmarks.split('app/')[1].split('/')[0]) > 1
    });
    const activeChat = classNames({
      active: currenthPath.indexOf(paths.chat.split('app/')[1].split('/')[0]) > 1
    });

    const teamMembers = [];

    _.forEach(subscribers, subscriber => {
      if (Object.keys(subscriber.teams).some(team => team === teamId)) {
        teamMembers.push({
          ...subscriber,
          online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
        });
      }
    });

    const currentOrg = subscriberOrgs.find(({ subscriberOrgId }) => subscriberOrgId === currentSubscriberOrgId);

    return (
      <Sider width={250} className={sideClass}>
        <div className="organizationHeader padding-class-a">
          <Tooltip placement="topLeft" title={String.t('sideBar.orgSummary')} arrowPointAtCenter>
            <div className="organizationHeader_org_info">{this.renderOrg(currentOrg)}</div>
          </Tooltip>
          {subscriberOrgs.length > 1 && (
            <Dropdown overlay={this.renderOrgs()} trigger={['click']}>
              <a>
                <i className="fas fa-chevron-down organizationsList" />
              </a>
            </Dropdown>
          )}
          <div className="clear" />
        </div>

        <div className="organizationLinks padding-class-a">
          <Tooltip placement="topLeft" title={String.t('sideBar.iconHomeTooltip')} arrowPointAtCenter>
            <Link to="/app" className={`habla-top-menu-home ${activeHome}`}>
              <i className="fa fa-home fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconCKGTooltip')} arrowPointAtCenter>
            <Link to={`/app/ckg/${currentSubscriberOrgId}`} className={`habla-top-menu-ckg ${activeCKG}`}>
              <i className="fas fa-chart-line fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconNotificationsTooltip')} arrowPointAtCenter>
            <Link to="/app/notifications" className={`habla-top-menu-notifications ${activeNotification}`}>
              <i className="fa fa-globe fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconBookmarksTooltip')} arrowPointAtCenter>
            <Link
              to={`/app/bookmarks/${currentSubscriberOrgId}`}
              className={`habla-top-menu-bookmarks ${activeBookmarks}`}
            >
              <i className="fa fa-bookmark fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.directMessages')} arrowPointAtCenter>
            <Link to="/app/chat" className={`habla-top-menu-settings ${activeChat}`}>
              <i className="fas fa-comments fa-2x" />
              {this.props.personalConversationUnreadMessages > 0 && (
                <span className="Icon__UnreadMessages">{this.props.personalConversationUnreadMessages}</span>
              )}
            </Link>
          </Tooltip>
        </div>
        <div className="sidebar-teams">
          <div className="sidebar-block-label sidebar-block-label-title">
            <span className="habla-label">
              <span className="sidebar-label-number-text">{String.t('teams')}</span>
              <span className="sidebar-label-number-badge">{this.state.teamsActive.length}</span>
            </span>
          </div>

          <div className="organization-list">
            <Menu
              mode="inline"
              openKeys={this.state.teamsOpenKeys}
              className="habla-left-navigation-list habla-left-navigation-organization-list"
            >
              {this.renderTeams(this.state.teamsActive)}
            </Menu>
          </div>
        </div>

        <div className="sidebar-actions">
          <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handleSearch} />
        </div>

        {teamMembers.length > 0 && (
          <div className="sidebar-direct-messages">
            <div className="sidebar-block-label">
              <span className="habla-label">
                {String.t('teamsMembers')}
                <span className="sidebar-label-number-badge">{teamMembers.length}</span>
              </span>
            </div>
            <div className="sidebar-direct-messages-content">
              {teamMembers.map(subscriber => this.renderSubscriberAvatar(subscriber))}
              {userRoles && userRoles.teamOwner.includes(teamId) && (
                <Tooltip placement="topLeft" title={String.t('sideBar.invitetoTeam')} arrowPointAtCenter>
                  <a>
                    <Avatar
                      className="mr-1"
                      onClick={() => {
                        this.props.history.push(`/app/inviteToTeam/${teamId}`);
                      }}
                    >
                      +
                    </Avatar>
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        )}
        <div className="sidebar-resize-icon">
          <i className="fas fa-bars" data-fa-transform="rotate-90" />
        </div>
        <VideoCallModal
          visible={this.state.videoCallModalVisible}
          showModal={this.showVideoCallModal}
          user={this.state.videoCallUser}
          videoCallReceived={this.state.videoCallReceived}
          teams={teams}
        />
      </Sider>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
