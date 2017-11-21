import React, { Component } from 'react';
import { Layout, Menu, Col, Row } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '../Avatar';
import String from '../../translations';
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
        <div className="Sidebar__name-container">
          <Avatar
            styles={{ minWidth: '20px', width: '20px', height: '20px' }}
            name={teamRoom.name}
            iconColor={teamRoom.preferences.iconColor}
            image={teamRoom.preferences.avatarBase64 || teamRoom.preferences.logo}
          />
          <div className="Sidebar__name-span" onClick={() => this.goToTeamRoomPage(teamRoom.teamRoomId)}>{teamRoom.name}</div>
        </div>
      </Menu.Item>),
    );
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
      return (
        <SubMenu
          key={team.teamId}
          onTitleClick={() => this.toogleTeams(team.teamId)}
          title={<Row>
            <Col xs={{ span: 22 }}>
              <div className="Sidebar__name-container">
                <Avatar
                  styles={{ minWidth: '20px', width: '20px', height: '20px' }}
                  name={team.name}
                  iconColor={team.preferences.iconColor}
                  image={team.preferences.avatarBase64 || team.preferences.logo}
                />
                <div className="Sidebar__name-span" onClick={e => this.goToTeamPage(e, team)}>{team.name}</div>
              </div>
            </Col>
          </Row>}
        >
          <Menu.Item className="Sidebar__menu-info-item">
            <div>
              {String.t('teamRooms')}
            </div>
          </Menu.Item>
          { teamRooms }
        </SubMenu>);
    });
  }

  renderOrgs() {
    const { subscriberOrgs } = this.props;
    return subscriberOrgs.map((subscriberOrg) => {
      const { preferences } = subscriberOrg;
      const teams = this.renderTeams(subscriberOrg.subscriberOrgId);

      return (
        <SubMenu
          key={subscriberOrg.subscriberOrgId}
          onMouseEnter={() => this.setState({ hovered: subscriberOrg.subscriberOrgId })}
          onMouseLeave={() => this.setState({ hovered: null })}
          openKeys={this.state.teamsOpenKeys}
          onTitleClick={() => this.toogleOrgs(subscriberOrg.subscriberOrgId)}
          title={
            <Row>
              <Col xs={{ span: 22 }} className="Sidebar__org-item-col">
                <div className="Sidebar__name-container">
                  <Avatar
                    iconColor={preferences.iconColor}
                    image={preferences.avatarBase64 || preferences.logo}
                    styles={{ minWidth: '20px', width: '20px', height: '20px' }}
                    name={subscriberOrg.name}
                  />
                  <div className="Sidebar__name-span" onClick={e => this.goToOrgPage(e, subscriberOrg.subscriberOrgId)}>{subscriberOrg.name}</div>
                </div>
              </Col>
            </Row>}
        >
          <Menu.Item className="Sidebar__menu-info-item">
            <div>
              {String.t('teams')}
            </div>
          </Menu.Item>
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
      <Sider width={235} className={sideClass}>

        <div className="Sidebar-menu-item-label">{String.t('organizations')}</div>
        <div className="organization-list">
          <Menu
            mode="inline"
            openKeys={_.union(this.state.orgsOpenKeys, this.state.teamsOpenKeys)}
            className="Sidebar__menu"
          >
            { this.renderOrgs() }
          </Menu>
          <div className="add-organization-button" onClick={this.handleAddOrganization}>
            <i className="Sidebar__i fa fa-plus" /> {String.t('sideBar.addOrganization')}
          </div>
        </div>
      </Sider>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
