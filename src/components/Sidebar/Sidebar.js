import React, { Component } from 'react';
import { Layout, Menu, Tooltip, Dropdown } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import String from '../../translations';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/Badge';
import {
  sortByName,
  primaryAtTop
} from '../../redux-hablaai/selectors/helpers';
import getInitials from '../../utils/helpers';
import './styles/style.css';


const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  fetchGlobalState: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  toggleTeamRoomDialog: PropTypes.func.isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.array.isRequired,
  subscribers: PropTypes.array,
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
  teams: [],
  teamRooms: []
};

const ROUTERS_TO_HIDE_SIDEBAR = [
  '/app/userDetails'
];

function renderSubscriberAvatar(subscriber) {
  const { firstName, lastName, userId, preferences, icon } = subscriber;
  const fullName = String.t('fullName', { firstName, lastName });
  const initials = getInitials(fullName);
  return (
    <Tooltip
      key={userId}
      placement="top"
      title={fullName}
    >
      {icon ?
        <Avatar size="default" src={`data:image/jpeg;base64, ${icon}`} className="mr-05" />
        :
        <Avatar
          size="default"
          ey={userId}
          color={preferences.iconColor}
          className="mr-05"
        >
          {initials}
        </Avatar>
      }
    </Tooltip>
  );
}

function renderAvatar(item) {
  const { preferences } = item;
  if (preferences.logo) {
    return <Avatar src={preferences.logo} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} />;
  }
  const nameInitial = item.name.substring(0, 1).toUpperCase();
  return <Avatar color={preferences.iconColor}>{nameInitial}</Avatar>;
}

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.orgsOpen = {};

    this.state = {
      orgsOpenKeys: [],
      teamsOpenKeys: [],

      hovered: null,
      openKeys: []
    };

    this.handleAddOrganization = this.handleAddOrganization.bind(this);

    this.toogleOrgs = this.toogleOrgs.bind(this);
    this.toogleTeams = this.toogleTeams.bind(this);

    this.goToOrgPage = this.goToOrgPage.bind(this);
    this.goToTeamRoomPage = this.goToTeamRoomPage.bind(this);
  }

  componentWillMount() {
    const { location, sideBarIsHidden } = this.props;
    if (sideBarIsHidden && !ROUTERS_TO_HIDE_SIDEBAR.includes(location.pathname)) {
      this.props.showSideBar();
    }
  }

  componentDidMount() {
    this.props.fetchGlobalState();
  }

  getTeamsIds(orgId) {
    const teams = this.props.teams.filter(team => team.subscriberOrgId === orgId);
    return teams.map(team => team.teamId);
  }

  handleAddOrganization() {
    this.props.toggleOrgDialog(true);
  }

  showTeamRoomDialog(e, teamId) {
    e.stopPropagation();
    this.props.toggleTeamRoomDialog(true, teamId);
  }

  showTeamDialog(e, orgId) {
    e.stopPropagation();
    this.props.toggleTeamDialog(true, orgId);
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
    const { teamRooms } = this.props;
    if (teamRooms.length === 0) {
      return null;
    }

    let teamRoomsByTeamId = teamRooms
      .filter(teamRoom => teamRoom.teamId === teamId)
      .sort(sortByName);

    if (teamRoomsByTeamId.length > 0) {
      teamRoomsByTeamId = primaryAtTop(teamRoomsByTeamId);
    }

    return teamRoomsByTeamId.map(teamRoom => (
      <Menu.Item key={teamRoom.teamRoomId}>
        <div className="habla-left-navigation-teamroom-list">
          <div className="habla-left-navigation-teamroom-list-item padding-class-a">
            <div className="float-left-class">
              {renderAvatar(teamRoom)}
            </div>
            <span className="habla-left-navigation-item-label" onClick={() => this.goToTeamRoomPage(teamRoom.teamRoomId)}>{teamRoom.name}</span>
            <div className="clear" />
            <Badge count={0 /* TODO: get the actual count of unread messages */} />
          </div>
        </div>
      </Menu.Item>
    ));
  }

  renderTeams() {
    const { teams } = this.props;
    const orgId = this.props.currentSubscriberOrgId;
    if (teams.length === 0) {
      return null;
    }

    let teamsByOrgId = teams
      .filter(team => team.subscriberOrgId === orgId)
      .sort(sortByName);

    teamsByOrgId = ((teamsByOrgId.length === 0) && (teamsByOrgId[0] === undefined)) ? [] : primaryAtTop(teamsByOrgId);

    return teamsByOrgId.map((team) => {
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
                  {renderAvatar(team)}
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
          <div className="sidebar-block-label">
            <span className="habla-label">
              {String.t('teamRooms')}
              {/* <span className="sidebar-label-number-badge">81</span> */}
            </span>
          </div>
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
          if (org.subscriberOrgId !== currentSubscriberOrgId) {
            this.goToOrgPage(e, org.subscriberOrgId);
          }
        }}
      >
        {renderAvatar(org)}
        <span className={className}>{org.name}</span>
      </a>
    );
  }

  renderOrgs() {
    const { subscriberOrgs } = this.props;
    return (
      <Menu className="organizationList">
        <div className="habla-label padding-class-a">{String.t('sideBar.organizationsLabel')}</div>
        <Menu.Item key="organizationList">
          {subscriberOrgs.map(org => this.renderOrg(org))}
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { subscriberOrgs, subscribers, sideBarIsHidden, currentSubscriberOrgId, teamIdsBySubscriberOrgId } = this.props;
    if (!teamIdsBySubscriberOrgId || !currentSubscriberOrgId || !teamIdsBySubscriberOrgId[currentSubscriberOrgId] ||
         subscriberOrgs.length === 0 || !subscribers) {
      return null;
    }
    const sideClass = classNames({
      Sidebar: true,
      hidden: sideBarIsHidden
    });
    const currentOrg = subscriberOrgs.find(({ subscriberOrgId }) => subscriberOrgId === currentSubscriberOrgId);
    const numberOfTeams = teamIdsBySubscriberOrgId[currentSubscriberOrgId].length;
    const addLinkSidebar = (
      <Menu className="addLinkSidebar">
        <div className="habla-label padding-class-a">{String.t('sideBar.addNewLabel')}</div>
        <Menu.Item key="addLinkSidebar">
          <a><span><i className="fas fa-plus-circle" /> {String.t('sideBar.addNewTeamMember')}</span></a>
        </Menu.Item>
        <Menu.Item key="addLinkSidebar">
          <a><span><i className="fas fa-plus-circle" /> {String.t('sideBar.addNewTeamRoom')}</span></a>
        </Menu.Item>
        <Menu.Item key="addLinkSidebar" className="dropdown-last-menu-item">
          <a><span><i className="fas fa-plus-circle" /> {String.t('sideBar.addNewTeam')}</span></a>
        </Menu.Item>
      </Menu>
    );
    const sortLinkSidebar = (
      <Menu className="sortLinkSidebar">
        <div className="habla-label padding-class-a">{String.t('sideBar.sortByLabel')}</div>
        <Menu.Item key="sortLinkSidebar">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByAlphabetical')}</span></a>
        </Menu.Item>
        <Menu.Item key="sortLinkSidebar">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByNewest')}</span></a>
        </Menu.Item>
        <Menu.Item key="sortLinkSidebar">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByUnread')}</span></a>
        </Menu.Item>
        <Menu.Item key="sortLinkSidebar" className="dropdown-last-menu-item">
          <a><span><i className="fas fa-check" /> {String.t('sideBar.sortByActivity')}</span></a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Sider width={250} className={sideClass}>
        <div className="organizationHeader padding-class-a">
          {renderAvatar(currentOrg)}
          <span className="subscriberorg-name">{currentOrg.name}</span>
          <Dropdown overlay={this.renderOrgs()} trigger={['click']}>
            <a>
              <i className="fas fa-ellipsis-h organizationsList" />
            </a>
          </Dropdown>
        </div>

        <div className="organizationLinks padding-class-a">
          <Tooltip placement="topLeft" title={String.t('sideBar.iconHomeTooltip')} arrowPointAtCenter>
            <Link to="/app" className="habla-top-menu-home">
              <i className="fa fa-home fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title={String.t('sideBar.iconCKGTooltip')} arrowPointAtCenter>
            <Link to="/app/ckg" className="habla-top-menu-ckg">
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
              <span className="sidebar-label-number-badge">{numberOfTeams}</span>
            </span>
          </div>

          <div className="organization-list">
            <Menu
              mode="inline"
              openKeys={this.state.teamsOpenKeys}
              className="habla-left-navigation-list habla-left-navigation-organization-list"
            >
              { this.renderTeams() }
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
          <a>
            <i className="fas fa-search" />
          </a>
        </div>

        <div className="sidebar-direct-messages">
          <div className="sidebar-block-label">
            <span className="habla-label">
              {String.t('directMessages')}
              {/* <span className="sidebar-label-number-badge">23</span> */}
            </span>
          </div>
          <div className="sidebar-direct-messages-content padding-class-a">
            {subscribers.map(subscriber => renderSubscriberAvatar(subscriber))}
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
