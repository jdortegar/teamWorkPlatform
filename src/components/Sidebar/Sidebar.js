import React, { Component } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import String from '../../translations';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/Badge';
import {
  sortByName,
  primaryAtTop
} from '../../redux-hablaai/selectors/helpers';
import './styles/style.css';


const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  fetchGlobalState: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  toggleTeamRoomDialog: PropTypes.func.isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  teamRooms: PropTypes.array.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  location: PropTypes.object.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  sideBarIsHidden: PropTypes.bool.isRequired,
  showSideBar: PropTypes.func.isRequired
};

const defaultProps = {
  subscriberOrgs: [],
  teams: [],
  teamRooms: []
};

const ROUTERS_TO_HIDE_SIDEBAR = [
  '/app/userDetails'
];

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

    this.cancelClickEvent(e);
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

  renderTeams(orgId) {
    const { teams } = this.props;
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
          onTitleClick={() => this.toogleTeams(team.teamId)}
          title={
            <div className="habla-left-navigation-team-list">
              <div className="habla-left-navigation-team-list-item padding-class-a">
                <div className="float-left-class">
                  {renderAvatar(team)}
                </div>
                <span className="habla-left-navigation-item-label" onClick={e => this.goToTeamPage(e, team)}>{team.name}</span>
                <div className="clear" />
                <Badge count={isTeamOpen ? 0 : unreadMessagesCount} />
              </div>
            </div>
          }
        >
          <div className="padding-class-a">
            <span className="habla-label">{String.t('teamRooms')} <span className="sidebar-label-number-badge">81</span></span>
          </div>
          { teamRooms }
        </SubMenu>);
    });
  }

  renderOrgs() {
    const { subscriberOrgs } = this.props;
    return subscriberOrgs.map((subscriberOrg) => {
      const teams = this.renderTeams(subscriberOrg.subscriberOrgId);

      return (
        <SubMenu
          className="habla-left-navigation-item"
          key={subscriberOrg.subscriberOrgId}
          onMouseEnter={() => this.setState({ hovered: subscriberOrg.subscriberOrgId })}
          onMouseLeave={() => this.setState({ hovered: null })}
          openKeys={this.state.teamsOpenKeys}
          onTitleClick={() => this.toogleOrgs(subscriberOrg.subscriberOrgId)}
          title={
            <div className="habla-left-navigation-org-list">
              <div className="padding-class-a">
                <div className="float-left-class">
                  {renderAvatar(subscriberOrg)}
                </div>
                <span className="habla-left-navigation-item-label" onClick={e => this.goToOrgPage(e, subscriberOrg.subscriberOrgId)}>{subscriberOrg.name}</span>
                <div className="clear" /></div>
            </div>
          }
        >
          {teams}
        </SubMenu>
      );
    });
  }

  render() {
    const { subscriberOrgs, sideBarIsHidden } = this.props;
    if (subscriberOrgs.length === 0) {
      return null;
    }
    const sideClass = classNames({
      Sidebar: true,
      hidden: sideBarIsHidden
    });

    return (
      <Sider width={250} className={sideClass}>
        <div className="organizationHeader padding-class-a">
          <Avatar />
          <span className="subscriberorg-name">Company, Inc.</span>
        </div>

        <div className="organizationLinks padding-class-a">
          <Tooltip placement="topLeft" title="Home" arrowPointAtCenter>
            <Link to="/app" className="habla-top-menu-home">
              <i className="fa fa-home fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title="CKG" arrowPointAtCenter>
            <Link to="/app/ckg" className="habla-top-menu-ckg">
              <i className="fas fa-chart-area fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title="Notifications" arrowPointAtCenter>
            <Link to="/app/notifications" className="habla-top-menu-notifications">
              <i className="fa fa-globe fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title="Bookmarks" arrowPointAtCenter>
            <Link to="/app/bookmarks" className="habla-top-menu-bookmarks">
              <i className="fa fa-bookmark fa-2x" />
            </Link>
          </Tooltip>
          <Tooltip placement="topLeft" title="Settings" arrowPointAtCenter>
            <Link to="/app/settings" className="habla-top-menu-settings">
              <i className="fa fa-cog fa-2x" />
            </Link>
          </Tooltip>
        </div>
        <div className="sidebar-teams-and-teamrooms">
          <div className="sidebar-block-label">
            <span className="habla-label">{String.t('teams')} <span className="sidebar-label-number-badge">23</span></span>
          </div>

          <div className="organization-list">
            <Menu
              mode="inline"
              openKeys={_.union(this.state.orgsOpenKeys, this.state.teamsOpenKeys)}
              className="habla-left-navigation-list habla-left-navigation-organization-list"
            >
              { this.renderOrgs() }
            </Menu>
          </div>
        </div>

        <div className="sidebar-actions">
          <Link to="/app/bookmarks" className="habla-top-menu-bookmarks">
            <i className="fas fa-plus-circle" />
          </Link>
          <Link to="/app/bookmarks" className="habla-top-menu-bookmarks">
            <i className="fas fa-sliders-h" />
          </Link>
          <Link to="/app/bookmarks" className="habla-top-menu-bookmarks">
            <i className="fas fa-search" />
          </Link>
        </div>

        <div className="sidebar-direct-messages">
          <div className="sidebar-block-label">
            <span className="habla-label">{String.t('directMessages')} <span className="sidebar-label-number-badge">23</span></span>
          </div>
          <div className="sidebar-direct-messages-content padding-class-a">
            <Avatar className="mr-1" />
            <Avatar className="mr-1" />
            <Avatar className="mr-1">+</Avatar>
          </div>
        </div>
      </Sider>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
