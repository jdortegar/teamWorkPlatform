import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleOrgDialog } from '../../actions';

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

  render() {
    return (
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          onClick={this.handleClick}
        >
          <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
            <Menu.Item key="1">option1</Menu.Item>
            <Menu.Item key="2">option2</Menu.Item>
            <Menu.Item key="3">option3</Menu.Item>
            <Menu.Item key="4">option4</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
            <Menu.Item key="5">option5</Menu.Item>
            <Menu.Item key="6">option6</Menu.Item>
            <Menu.Item key="7">option7</Menu.Item>
            <Menu.Item key="8">option8</Menu.Item>
          </SubMenu>
          <Menu.Item key="add-org"><Icon type="plus" />Add Organization</Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return {
    subscriberOrgs: state.subscriberOrgs
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleOrgDialog }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
