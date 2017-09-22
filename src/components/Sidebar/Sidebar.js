import React, { Component } from 'react';
import { Layout, Menu, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserIcon from '../UserIcon';
import './styles/style.css';


const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  requestSubscriberOrgs: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  toggleTeamRoomDialog: PropTypes.func.isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  requestAllTeamRooms: PropTypes.func.isRequired,
  requestAllTeams: PropTypes.func.isRequired,
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

    this.state = { hovered: null };

    this.handleClick = this.handleClick.bind(this);
    this.onClickEditOrg = this.onClickEditOrg.bind(this);
  }

  componentDidMount() {
    this.props.requestSubscriberOrgs();
    this.props.requestAllTeams();
    this.props.requestAllTeamRooms();
  }

  onClickEditOrg(e, orgId, url) {
    e.stopPropagation();
    this.setState({ selected: orgId });
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
    return this.props.teamRooms.reduce((acc, teamRoom) => {
      if (teamId === teamRoom.teamId) {
        acc.push(
          <Menu.Item key={teamRoom.teamRoomId}>
            <Link to={`/app/teamRoom/${teamRoom.teamRoomId}`}><i className="sidebar__i fa fa-comments" />{teamRoom.name}</Link>
          </Menu.Item>
        );
      }

      return acc;
    }, []);
  }

  renderTeams(orgId) {
    return this.props.teams.reduce((acc, team) => {
      if (team.subscriberOrgId === orgId) {
        const teamRooms = this.renderTeamRooms(team.teamId);
        console.log(team);
        acc.push(
          <SubMenu
            key={team.teamId}
            title={<Row gutter={16}>
              <Col xs={{ span: 22 }}>
                <a onClick={e => this.onClickEditOrg(e, team.subscriberOrgId, `/app/team/${team.teamId}`)}>
                  <div className="Sidebar__name-container">
                    <UserIcon user={team} type="team" minWidth="20px" width="20px" height="20px" clickable={false} />
                    <span className="Sidebar__name-span">{team.name}</span>
                  </div>
                </a>
              </Col>
            </Row>}
          >
            { teamRooms }
          </SubMenu>
        );
      }

      return acc;
    }, []);
  }

  renderOrgs() {
    return this.props.subscriberOrgs.map((subscriberOrg) => {
      const teams = this.renderTeams(subscriberOrg.subscriberOrgId);

      return (
        <SubMenu
          key={subscriberOrg.subscriberOrgId}
          onMouseEnter={() => this.setState({ hovered: subscriberOrg.subscriberOrgId })}
          onMouseLeave={() => this.setState({ hovered: null })}
          title={
            <Row gutter={16}>
              <Col xs={{ span: 22 }}>
                <a onClick={e => this.onClickEditOrg(e, subscriberOrg.subscriberOrgId, `/app/organization/${subscriberOrg.subscriberOrgId}`)}>
                  <div className="Sidebar__name-container">
                    <UserIcon user={subscriberOrg} type="team" minWidth="20px" width="20px" height="20px" clickable={false} />
                    <span className="Sidebar__name-span">{subscriberOrg.name}</span>
                  </div>
                </a>
              </Col>
            </Row>}
        >
          {teams}
        </SubMenu>
      );
    });
  }

  render() {
    if (this.props.subscriberOrgs.length === 0) {
      return null;
    }

    return (
      <Sider width={235} style={{ background: '#fff' }} className="Sidebar">

        <div className="sidebar-menu-item-label">Your Organizations</div>
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          onClick={this.handleClick}
        >
          { this.renderOrgs() }
          <Menu.Item key="add-org">
            <div className="add-organization-button">
              <i className="sidebar__i fa fa-plus" /> Add Organization
            </div>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
