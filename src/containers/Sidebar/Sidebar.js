import React, { Component } from 'react';
import { Layout, Dropdown, Menu, Icon, Col, Row } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toggleOrgDialog, requestSubscriberOrgs, requestAllTeams } from '../../actions';

const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  requestSubscriberOrgs: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  requestAllTeams: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired
};

const defaultProps = {
  subscriberOrgs: [],
  teams: []
};

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.requestSubscriberOrgs();
    this.props.requestAllTeams();
  }

  handleClick({ key }) {
    switch (key) {
      case 'add-org':
        return this.props.toggleOrgDialog(true);
      default:
        return null;
    }
  }

  renderTeams(orgId) {
    return this.props.teams.reduce((acc, team) => {
      if (team.subscriberOrgId === orgId) {
        acc.push(<Menu.Item key={team.teamId}>{team.name}</Menu.Item>);
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
            <a>Invite People</a>
          </Menu.Item>
        </Menu>
      );

      return (
        <SubMenu
          key={subscriberOrgId}
          title={
            <Row gutter={16}>
              <Col xs={{ span: 18 }}><span><Icon type="user" />{name}</span></Col>
              <Col xs={{ span: 4 }}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a onClick={(e)=>e.stopPropagation()} title="Settings"><Icon type="setting" /></a>
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
      <Sider width={225} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          onClick={this.handleClick}
        >
          { this.renderOrgs() }
          <Menu.Item key="add-org"><Icon type="plus" />Add Organization</Menu.Item>
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
    currentTeamIdBySubscriberOrgId: state.teams.currentTeamIdBySubscriberOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleOrgDialog, requestSubscriberOrgs, requestAllTeams }, dispatch);
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
