import React, { Component } from 'react';
import { Layout, Menu, Col, Row } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { toggleOrgDialog,
  requestSubscriberOrgs,
  requestAllTeams, requestAllTeamRooms,
  toggleInvitePeopleDialog, toggleOrgSettingsDialog,
  toggleTeamDialog, toggleTeamRoomDialog, setCurrentSubscriberOrgId
} from '../../actions';
import { getSubscriberOrgs } from '../../selectors';
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
  }).isRequired
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
    this.teamClicked = this.teamClicked.bind(this);
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

  teamClicked(e, teamId) {
    e.stopPropagation();
    this.props.history.push(`/app/team/${teamId}`);
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
    return this.props.teams.reduce((acc, { name, teamId, subscriberOrgId }) => {
      if (subscriberOrgId === orgId) {
        const teamRooms = this.renderTeamRooms(teamId);

        acc.push(
          <SubMenu
            key={teamId}
            title={<Row gutter={16}>
              <Col xs={{ span: 22 }}>
                <a onClick={e => this.teamClicked(e, teamId)}>
                  <span><i className="sidebar__i fa fa-users" />{name}</span>
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

      return (
        <SubMenu
          key={subscriberOrgId}
          onMouseEnter={() => this.setState({ hovered: subscriberOrgId })}
          onMouseLeave={() => this.setState({ hovered: null })}
          title={
            <Row gutter={16}>
              <Col xs={{ span: 18 }}>
                <a onClick={e => this.onClickEditOrg(e, subscriberOrgId, `/app/organization/${subscriberOrgId}`)}>
                  <span><i className="sidebar__i fa fa-building" />{name}</span>
                </a>
              </Col>
              <Col xs={{ span: 3 }}>
                {
                  (this.state.hovered === subscriberOrgId) || (this.props.currentSubscriberOrgId === subscriberOrgId) ?
                    <a onClick={e => this.onClickEditOrg(e, subscriberOrgId, `/app/organization/${subscriberOrgId}`)} title="Edit">
                      <i className="sidebar__i fa fa-pencil" aria-hidden="true" />
                    </a> : null
                }
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
    //subscriberOrgs: state.subscriberOrgs.raw,
    subscriberOrgs: getSubscriberOrgs(state),
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
    teams: state.teams.raw,
    teamById: state.teams.teamById,
    teamIdsBySubscriberOrgId: state.teams.teamIdsBySubscriberOrgId,
    teamRooms: state.teamRooms.raw,
    currentTeamIdBySubscriberOrgId: state.teams.currentTeamIdBySubscriberOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentSubscriberOrgId,
    toggleOrgDialog,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));
