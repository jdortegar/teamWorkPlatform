import React, { Component } from 'react';
import { Layout, Menu, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserIcon from '../UserIcon';
import messages from './messages';
import {
  sortByName,
  primaryAtTop,
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
  setCurrentSubscriberOrgId: PropTypes.func.isRequired
};

const defaultProps = {
  subscriberOrgs: [],
  teams: [],
  teamRooms: []
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = { hovered: null, openKeys: [], teamOpenKeys: [] };

    this.handleClick = this.handleClick.bind(this);
    this.onClickEditOrg = this.onClickEditOrg.bind(this);
    this.handleAddOrganization = this.handleAddOrganization.bind(this);
  }

  componentDidMount() {
    this.props.fetchGlobalState();
  }

  onClickEditOrg(e, orgId, url, teamId = null) {
    e.stopPropagation();
    if (teamId) {
      this.setState({ selected: orgId, openKeys: [orgId, teamId] });
    } else {
      const teams = this.props.teams.filter(team => team.subscriberOrgId === orgId);
      const teamIds = teams.map(team => team.teamId);
      this.setState({ selected: orgId, openKeys: [orgId, ...teamIds] });
    }
    this.props.setCurrentSubscriberOrgId(orgId);
    this.props.history.push(url);
  }

  handleClick({ key }) {
    switch (key) {
      case 'add-org':
        return this.props.toggleOrgDialog(true);
      default:
        return null;
    }
  }

  showTeamDialog(e, orgId) {
    e.stopPropagation();
    this.props.toggleTeamDialog(true, orgId);
  }

  showTeamRoomDialog(e, teamId) {
    e.stopPropagation();
    this.props.toggleTeamRoomDialog(true, teamId);
  }

  renderTeamRooms(teamId) {
    const { teamRooms } = this.props;
    if (teamRooms.length === 0) {
      return null;
    }

    let teamRoomsByTeamId = teamRooms
      .filter((teamRoom) => teamRoom.teamId === teamId)
      .sort(sortByName);

    if (teamRoomsByTeamId.length > 0) {
      teamRoomsByTeamId = primaryAtTop(teamRoomsByTeamId);
    }

    return teamRoomsByTeamId.map(teamRoom =>
      <Menu.Item key={teamRoom.teamRoomId}>
        <div className="Sidebar__name-container">
          <UserIcon user={teamRoom} type="team" minWidth="20px" width="20px" height="20px" clickable={false} />
          <Link to={`/app/teamRoom/${teamRoom.teamRoomId}`} className="Sidebar__name-span">
            {teamRoom.name}
          </Link>
        </div>
      </Menu.Item>
    )
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
      return <SubMenu
        key={team.teamId}
        title={<Row>
          <Col xs={{ span: 22 }}>
            <a onClick={e => this.onClickEditOrg(e, team.subscriberOrgId, `/app/team/${team.teamId}`, team.teamId)}>
              <div className="Sidebar__name-container">
                <UserIcon user={team} type="team" minWidth="20px" width="20px" height="20px" clickable={false} />
                <span className="Sidebar__name-span">{team.name}</span>
              </div>
            </a>
          </Col>
        </Row>}
      >
        <Menu.Item className="Sidebar__menu-info-item">
          <div>
            {messages.teamRooms}
          </div>
        </Menu.Item>
        { teamRooms }
      </SubMenu>;
    });
  }

  renderOrgs() {
    const { subscriberOrgs } = this.props;
    return subscriberOrgs.map((subscriberOrg) => {
      const teams = this.renderTeams(subscriberOrg.subscriberOrgId);

      return (
        <SubMenu
          key={subscriberOrg.subscriberOrgId}
          onMouseEnter={() => this.setState({ hovered: subscriberOrg.subscriberOrgId })}
          onMouseLeave={() => this.setState({ hovered: null })}
          openKeys={this.state.teamOpenKeys}
          title={
            <Row>
              <Col xs={{ span: 22 }} className="Sidebar__org-item-col">
                <a onClick={e => this.onClickEditOrg(e, subscriberOrg.subscriberOrgId, `/app/organization/${subscriberOrg.subscriberOrgId}`)}>
                  <div className="Sidebar__name-container">
                    <UserIcon user={subscriberOrg} type="team" minWidth="20px" width="20px" height="20px" clickable={false} />
                    <span className="Sidebar__name-span">{subscriberOrg.name}</span>
                  </div>
                </a>
              </Col>
            </Row>}
        >
          <Menu.Item className="Sidebar__menu-info-item">
            <div>
              {messages.teams}
            </div>
          </Menu.Item>
          {teams}
        </SubMenu>
      );
    });
  }

  handleAddOrganization() {
    this.props.toggleOrgDialog(true);
  }

  render() {
    if (this.props.subscriberOrgs.length === 0) {
      return null;
    }

    return (
      <Sider width={235} style={{ background: '#fff' }} className="Sidebar">

        <div className="Sidebar-menu-item-label">{messages.organizations}</div>
        <div className="organization-list">
          <Menu
            mode="inline"
            onClick={this.handleClick}
            openKeys={this.state.openKeys}
            className="Sidebar__menu"
          >
            { this.renderOrgs() }
          </Menu>
          <div className="add-organization-button" onClick={this.handleAddOrganization}>
            <i className="Sidebar__i fa fa-plus" /> {messages.addOrganization}
          </div>
        </div>
      </Sider>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
