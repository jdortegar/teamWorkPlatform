import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { toggleOrgDialog, requestSubscriberOrgs, requestAllTeams } from '../../actions';

const { Sider } = Layout;
const { SubMenu } = Menu;

const propTypes = {
  requestSubscriberOrgs: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  requestAllTeams: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired
};

const defaultProps = {
  subscriberOrgs: {},
  teams: {}
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
    return this.props.subscriberOrgs.map((org) => {
      const teams = this.renderTeams(org.subscriberOrgId);
      return (
        <SubMenu key={org.subscriberOrgId} title={<span><Icon type="user" />{org.name}</span>}>
          {teams}
        </SubMenu>
      );
    });
  }

  render() {
    return (
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          onClick={this.handleClick}
        >
          { this.renderOrgs() }
          <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="3">option3</Menu.Item>
            <Menu.Item key="4">option4</Menu.Item>
          </SubMenu>
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
