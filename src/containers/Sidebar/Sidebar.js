import React, { Component } from 'react';
import { Layout, Dropdown, Menu, Icon, Col, Row } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toggleOrgDialog,
  requestSubscriberOrgs,
  requestAllTeams, requestAllTeamRooms,
  toggleInvitePeopleDialog, toggleOrgSettingsDialog,
  toggleTeamDialog, toggleTeamRoomDialog
} from '../../actions';
import './styles/style.css';


const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  requestSubscriberOrgs: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  toggleInvitePeopleDialog: PropTypes.func.isRequired,
  toggleTeamRoomDialog: PropTypes.func.isRequired,
  toggleOrgSettingsDialog: PropTypes.func.isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  requestAllTeamRooms: PropTypes.func.isRequired,
  requestAllTeams: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  teamRooms: PropTypes.array.isRequired
};

const defaultProps = {
  subscriberOrgs: [],
  teams: [],
  teamRooms: []
};


class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.requestSubscriberOrgs();
    this.props.requestAllTeams();
    this.props.requestAllTeamRooms();
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
        acc.push(<Menu.Item key={teamRoom.teamRoomId}>
          <i className="sidebar__i fa fa-comments" aria-hidden="true" />{teamRoom.name}
        </Menu.Item>);
      }

      return acc;
    }, []);
  }

  renderTeams(orgId) {
    return this.props.teams.reduce((acc, { name, teamId, subscriberOrgId }) => {
      if (subscriberOrgId === orgId) {
        const teamRooms = this.renderTeamRooms(teamId);

        acc.push(
          <SubMenu
            key={teamId}
            title={<Row gutter={16}>
              <Col xs={{ span: 18 }}><span><i className="sidebar__i fa fa-users" aria-hidden="true" />{name}</span></Col>
              <Col xs={{ span: 3 }}>
                <a title="Add Team Room" onClick={e => this.showTeamRoomDialog(e, teamId)}>
                  <i className="fa fa-plus" aria-hidden="true" />
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
    return this.props.subscriberOrgs.map(({ subscriberOrgId, name }) => {
      const teams = this.renderTeams(subscriberOrgId);
      const menu = (
        <Menu>
          <Menu.Item key="0">
            <Link to={`/app/integrations/${subscriberOrgId}`}>Integrations</Link>
          </Menu.Item>
          <Menu.Item key="1">
            <a onClick={() => this.props.toggleInvitePeopleDialog(true, subscriberOrgId)}>
              <i className="fa fa-user-plus" aria-hidden="true" /> Invite People
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a onClick={() => this.props.toggleOrgSettingsDialog(true, subscriberOrgId)}>Settings</a>
          </Menu.Item>
        </Menu>
      );

      return (
        <SubMenu
          key={subscriberOrgId}
          title={
            <Row gutter={16}>
              <Col xs={{ span: 17 }}><span><i className="sidebar__i fa fa-building" aria-hidden="true" />{name}</span></Col>
              <Col xs={{ span: 2 }}>
                <a title="Add Team" onClick={e => this.showTeamDialog(e, subscriberOrgId)}>
                  <i className="fa fa-plus" aria-hidden="true" />
                </a>
              </Col>
              <Col xs={{ span: 3 }}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a onClick={e => e.stopPropagation()} title="Settings">
                    <i className="sidebar__i fa fa-cog" aria-hidden="true" />
                  </a>
                </Dropdown>
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
      <Sider width={235} style={{ background: '#fff' }}>

        <div className="sidebar-menu-item-label">Your Organizations</div>
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          onClick={this.handleClick}
        >
          { this.renderOrgs() }
          <Menu.Item key="add-org">
            <div className="add-organization-button">
              <i className="sidebar__i fa fa-plus" aria-hidden="true" /> Add Organization
            </div>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return {
    subscriberOrgs: state.subscriberOrgs.raw,
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
    teams: state.teams.raw,
    teamById: state.teams.teamById,
    teamIdsBySubscriberOrgId: state.teams.teamIdsBySubscriberOrgId,
    teamRooms: state.teamRooms.raw,
    currentTeamIdBySubscriberOrgId: state.teams.currentTeamIdBySubscriberOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleOrgDialog,
    requestSubscriberOrgs,
    requestAllTeams,
    toggleInvitePeopleDialog,
    requestAllTeamRooms,
    toggleOrgSettingsDialog,
    toggleTeamDialog,
    toggleTeamRoomDialog }, dispatch);
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
