import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleOrgDialog } from '../../actions';
import './styles/style.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick({ key }) {
    switch (key) {
      case "add-org":
        return this.props.toggleOrgDialog(true);
      default:
        return;
    }
  }

  renderTeams(orgId) {
    return this.props.teams.reduce((acc, team) => {
      if(team.subscriberOrgId === orgId) {
        acc.push(<Menu.Item key={team.teamId}>{team.name}</Menu.Item>);
      }

      return acc;
    }, []);
  }

  renderOrgs() {
    return this.props.subscriberOrgs.map((org, index) => {
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
      
      <div className="sidebar-menu-item-label">Your Organizations</div>
      
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
          
          <Menu.Item key="add-org"><div className="add-organization-button"><Icon type="plus" />Add Organization</div></Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return {
    subscriberOrgs: state.subscriberOrgs.raw,
    teams: state.teams.raw
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleOrgDialog }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
