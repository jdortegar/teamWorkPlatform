import React, { Component } from 'react';
import { Layout, Menu, Tooltip, Dropdown, Input, Icon } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import String from '../../translations';
import Avatar from '../../components/common/Avatar';
import AvatarWrapper from '../common/Avatar/AvatarWrapper';
import Badge from '../../components/Badge';
import {
  sortByName,
  primaryAtTop
} from '../../redux-hablaai/selectors/helpers';
import './styles/style.css';


const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  user: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.array.isRequired,
  subscribers: PropTypes.array,
  subscribersPresences: PropTypes.object,
  teams: PropTypes.array.isRequired,
  teamRooms: PropTypes.array.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.object.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  sideBarIsHidden: PropTypes.bool.isRequired,
  showSideBar: PropTypes.func.isRequired,
  currentSubscriberOrgId: PropTypes.string,
  teamIdsBySubscriberOrgId: PropTypes.object.isRequired
};

const defaultProps = {
  currentSubscriberOrgId: null,
  subscriberOrgs: [],
  subscribers: null,
  subscribersPresences: {},
  teams: [],
  teamRooms: []
};

const ROUTERS_TO_HIDE_SIDEBAR = [
  '/app/userDetails'
];

function renderSubscriberAvatar(subscriber) {
  const { firstName, lastName, userId } = subscriber;
  const fullName = String.t('fullName', { firstName, lastName });
  return (
    <Tooltip key={userId} placement="top" title={fullName}>
      <AvatarWrapper size="default" user={subscriber} className="mr-05 mb-05" hideStatusTooltip />
    </Tooltip>
  );
}

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
  return <Avatar color={preferences.iconColor} className={className}>{nameInitial}</Avatar>;
}

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.orgsOpen = {};
    const { teams, currentSubscriberOrgId } = this.props;
    const teamsActive = teams.filter(team => (team.subscriberOrgId === currentSubscriberOrgId) && team.active);

    this.teamsActive = teamsActive;

    this.state = {
      orgsOpenKeys: [],
      teamsOpenKeys: [],
      teamsActive,
      hovered: null,
      openKeys: []
    };

    this.goToOrgPage = this.goToOrgPage.bind(this);
    this.goToTeamRoomPage = this.goToTeamRoomPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillMount() {
    const { location, sideBarIsHidden } = this.props;
    if (sideBarIsHidden && !ROUTERS_TO_HIDE_SIDEBAR.includes(location.pathname)) {
      this.props.showSideBar();
    }
  }

  getTeamsIds(orgId) {
    const teams = this.props.teams.filter(team => team.subscriberOrgId === orgId);
    return teams.map(team => team.teamId);
  }

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
      const filteredTeams = this.state.teamsActive.filter((el) => {
        return el.name.toLowerCase().includes(value.toLowerCase().trim());
      });
      this.setState({ teamsActive: filteredTeams });
    }
  }

  goToTeamPage(e, team) {
    this.props.setCurrentSubscriberOrgId(team.subscriberOrgId);
    this.props.history.push(`/app/team/${team.teamId}`);

    this.cancelClickEvent(e);
  }

  toogleOrgs(orgId) {
    const teamIds = this.getTeamsIds(orgId);

    if (this.orgsOpen[orgId]) {
      this.setState({
        orgsOpenKeys: [orgId],
        teamsOpenKeys: [...this.state.teamsOpenKeys]
      });
    } else {
      /* FIRST TIME USER CLICK ON A ORGANIZATION */
      this.orgsOpen[orgId] = true;
      this.setState({
        orgsOpenKeys: [orgId],
        teamsOpenKeys: [...this.state.teamsOpenKeys, ...teamIds]
      });
    }
  }

  goToOrgPage(e, orgId) {
    const teamIds = this.getTeamsIds(orgId);

    if (this.orgsOpen[orgId]) {
      this.setState({
        orgsOpenKeys: [orgId],
        teamsOpenKeys: [...this.state.teamsOpenKeys]
      });
    } else {
      /* FIRST TIME USER CLICK ON A ORGANIZATION */
      this.orgsOpen[orgId] = true;
      this.setState({
        orgsOpenKeys: [orgId],
        teamsOpenKeys: [...this.state.teamsOpenKeys, ...teamIds]
      });
    }

    this.props.setCurrentSubscriberOrgId(orgId);
    this.props.history.push(`/app/organization/${orgId}`);
  }

  goToTeamRoomPage(teamRoomId) {
    this.props.history.push(`/app/teamRoom/${teamRoomId}`);
  }

  renderTeamRooms(teamId) {
    const { teamRooms, user } = this.props;
    if (teamRooms.length === 0) {
      return null;
    }

    let teamRoomsByTeamId = teamRooms
      .filter(teamRoom => teamRoom.teamId === teamId)
      .sort(sortByName);

    if (teamRoomsByTeamId.length > 0) {
      teamRoomsByTeamId = primaryAtTop(teamRoomsByTeamId);
    }

    return teamRoomsByTeamId.map((teamRoom) => {
      let isAdmin = false;
      if (teamRoom.teamRoommMembers) {
        const teamRoomMemberFoundByUser = _.find(teamRoom.teamRoomMembers, { userId: user.userId });
        isAdmin = teamRoomMemberFoundByUser.teamRooms[teamRoom.teamRoomId].role === 'admin';
      }
      if (!isAdmin && (!teamRoom.active || teamRoom.deleted)) return null;

      return (
        <Menu.Item key={teamRoom.teamRoomId}>
          <div className="habla-left-navigation-teamroom-list">
            <div className="habla-left-navigation-teamroom-list-item padding-class-a">
              <div className="float-left-class">
                {renderAvatar(teamRoom, teamRoom.active)}
              </div>
              <span className="habla-left-navigation-item-label" onClick={() => this.goToTeamRoomPage(teamRoom.teamRoomId)}>{teamRoom.name}</span>
              <div className="clear" />
              <Badge count={0 /* TODO: get the actual count of unread messages */} />
            </div>
          </div>
        </Menu.Item>
      );
    });
  }

  renderTeams(teamsActive) {
    const { user } = this.props;
    if (teamsActive.length === 0) {
      return null;
    }

    let teamsByOrgId = teamsActive.sort(sortByName);

    teamsByOrgId = ((teamsByOrgId.length === 0) && (teamsByOrgId[0] === undefined)) ? [] : primaryAtTop(teamsByOrgId);

    return teamsByOrgId.map((team) => {
      let isAdmin = false;
      if (team.teamMembers) {
        const teamMemberFoundByUser = _.find(team.teamMembers, { userId: user.userId });
        isAdmin = teamMemberFoundByUser.teams[team.teamId].role === 'admin';
      }
      if (!isAdmin && (!team.active || team.deleted)) {
        return null;
      }

      const teamRooms = this.renderTeamRooms(team.teamId);
      const isTeamOpen = _.includes(this.state.teamsOpenKeys, team.teamId);
      const unreadMessagesCount = 0; /* TODO: get the actual count of unread messages */

      return (
        <SubMenu
          className="habla-left-navigation-item"
          key={team.teamId}
          onMouseEnter={() => this.setState({ hovered: team.teamId })}
          onMouseLeave={() => this.setState({ hovered: null })}
          openKeys={this.state.teamsOpenKeys}
          onTitleClick={() => this.toogleTeams(team.teamId)}
          title={
            <div className="habla-left-navigation-team-list">
              <div className="habla-left-navigation-team-list-item padding-class-a">
                <div className="float-left-class">
                  {renderAvatar(team, team.active)}
                </div>
                <span className="habla-left-navigation-item-label" onClick={e => this.goToTeamPage(e, team)}>
                  {team.name}
                </span>
                <div className="clear" />
                <Badge count={isTeamOpen ? 0 : unreadMessagesCount} />
              </div>
            </div>
          }
        >
          <Menu.Item key="roomsLabel">
            <div className="sidebar-block-label">
              <span className="habla-label">
                {String.t('teamRooms')}
                {/* <span className="sidebar-label-number-badge">81</span> */}
              </span>
            </div>
          </Menu.Item>
          { teamRooms }
        </SubMenu>);
    });
  }

  renderOrg(org) {
    const { currentSubscriberOrgId } = this.props;
    const className = (org.subscriberOrgId === currentSubscriberOrgId) ? 'subscriberorg-name-current' : 'subscriberorg-name';
    return (
      <a
        className="habla-top-menu-settings"
        key={org.subscriberOrgId}
        onClick={(e) => {
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
        <Menu.Item key="organizationList">
          {subscriberOrgs.map(org => this.renderOrg(org))}
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { teams, subscriberOrgs, subscribers, subscribersPresences, sideBarIsHidden, currentSubscriberOrgId, teamIdsBySubscriberOrgId } = this.props;
    if (!teamIdsBySubscriberOrgId || !currentSubscriberOrgId || !teamIdsBySubscriberOrgId[currentSubscriberOrgId] ||
        !teams || subscriberOrgs.length === 0 || !subscribers || !subscribersPresences) {
      return null;
    }
    const sideClass = classNames({
      Sidebar: true,
      hidden: sideBarIsHidden
    });

    const orgSubscribers = subscribers.map(subscriber => ({
      ...subscriber,
      online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
    }));

    const currentOrg = subscriberOrgs.find(({ subscriberOrgId }) => subscriberOrgId === currentSubscriberOrgId);
    const addLinkSidebar = (
      <Menu>
        <Menu.Item key="addLinksHeader">
          <div className="habla-label padding-class-a">{String.t('sideBar.addNewLabel')}</div>
        </Menu.Item>
        <Menu.Item key="addMember">
          <a><span><i className="fas fa-plus-circle" /> {String.t('sideBar.addNewTeamMember')}</span></a>
        </Menu.Item>
        <Menu.Item key="addRoom">
          <a><span><i className="fas fa-plus-circle" /> {String.t('sideBar.addNewTeamRoom')}</span></a>
        </Menu.Item>
        <Menu.Item key="addTeam" className="dropdown-last-menu-item">
          <a><span><i className="fas fa-plus-circle" /> {String.t('sideBar.addNewTeam')}</span></a>
        </Menu.Item>
      </Menu>
    );
    const sortLinkSidebar = (
      <Menu className="sortLinkSidebar">
        <Menu.Item key="sortLinkHeader">
          <div className="habla-label padding-class-a">{String.t('sideBar.sortByLabel')}</div>
        </Menu.Item>
        <Menu.Item key="sortByAlph">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByAlphabetical')}</span></a>
        </Menu.Item>
        <Menu.Item key="sortByDate">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByNewest')}</span></a>
        </Menu.Item>
        <Menu.Item key="sortByUnread">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByUnread')}</span></a>
        </Menu.Item>
        <Menu.Item key="sortByActivity" className="dropdown-last-menu-item">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByActivity')}</span></a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Sider width={250} className={sideClass}>
        <div className="organizationHeader padding-class-a">
          <div className="organizationHeader_org_info">
            {this.renderOrg(currentOrg)}
          </div>
          {subscriberOrgs.length > 1 &&
            <Dropdown overlay={this.renderOrgs()} trigger={['click']}>
              <a>
                <i className="fas fa-ellipsis-h organizationsList" />
              </a>
            </Dropdown>
          }
          <div className="clear" />
        </div>

        <div className="organizationLinks padding-class-a">
          <Tooltip placement="topLeft" title={String.t('sideBar.iconHomeTooltip')} arrowPointAtCenter>
            <Link to="/app" className="habla-top-menu-home">
              <i className="fa fa-home fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconCKGTooltip')} arrowPointAtCenter>
            <Link to={`/app/ckg/${currentSubscriberOrgId}`} className="habla-top-menu-ckg">
              <i className="fas fa-chart-area fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconNotificationsTooltip')} arrowPointAtCenter>
            <Link to="/app/notifications" className="habla-top-menu-notifications">
              <i className="fa fa-globe fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconBookmarksTooltip')} arrowPointAtCenter>
            <Link to="/app/bookmarks" className="habla-top-menu-bookmarks">
              <i className="fa fa-bookmark fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconSettingsTooltip')} arrowPointAtCenter>
            <Link to={`/app/organization/${currentSubscriberOrgId}`} className="habla-top-menu-settings">
              <i className="fa fa-cog fa-2x" />
            </Link>
          </Tooltip>
        </div>
        <div className="sidebar-teams-and-teamrooms">
          <div className="sidebar-block-label">
            <span className="habla-label">
              {String.t('teams')}
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
          <Dropdown overlay={addLinkSidebar} trigger={['click']}>
            <a>
              <i className="fas fa-plus-circle" />
            </a>
          </Dropdown>
          <Dropdown overlay={sortLinkSidebar} trigger={['click']}>
            <a>
              <i className="fas fa-sliders-h" />
            </a>
          </Dropdown>
          <Input
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.handleSearch}
          />
        </div>

        <div className="sidebar-direct-messages">
          <div className="sidebar-block-label">
            <span className="habla-label">
              {String.t('directMessages')}
              {/* <span className="sidebar-label-number-badge">23</span> */}
            </span>
          </div>
          <div className="sidebar-direct-messages-content padding-class-a">
            {orgSubscribers.map(subscriber => renderSubscriberAvatar(subscriber))}
            <Tooltip placement="topLeft" title={String.t('sideBar.newDirectMessageTooltip')} arrowPointAtCenter>
              <a>
                <Avatar className="mr-1">+</Avatar>
              </a>
            </Tooltip>
          </div>
        </div>
        <div className="sidebar-resize-icon">
          <i className="fas fa-bars" data-fa-transform="rotate-90" />
        </div>
      </Sider>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
