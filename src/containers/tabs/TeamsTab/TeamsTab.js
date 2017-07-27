import React, { Component } from 'react';
import { Layout, Form, Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formShape } from '../../../propTypes';

const SubMenu = Menu.SubMenu;

const propTypes = {
  form: formShape.isRequired,
  layout: PropTypes.object,
  teams: PropTypes.array.isRequired,
  orgSettingsDialog: PropTypes.object.isRequired
};

const defaultProps = {
  layout: {
    labelCol: { xs: 24 },
    wrapperCol: { xs: 24 }
  }
};

class TeamsTab extends Component {
  renderTeams(orgId) {
    return this.props.teams.reduce((acc, team) => {
      if (team.subscriberOrgId === orgId) {
        acc.push(<Menu.Item key={team.teamId}>{team.name}</Menu.Item>);
      }

      return acc;
    }, []);
  }

  render() {
    // const { layout } = this.props;
    return (
      <Layout className="ant-layout-has-sider" style={{ minHeight: '100vh' }}>
        <Menu style={{ width: 150 }} mode="vertical">
          { this.renderTeams(this.props.orgSettingsDialog.orgId) }
        </Menu>
        <Layout>
          Cool Stuff
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    teams: state.teams.raw,
    orgSettingsDialog: state.dialogs.orgSettingsDialog
  };
}

TeamsTab.propTypes = propTypes;
TeamsTab.defaultProps = defaultProps;

export default Form.create()(connect(mapStateToProps, null)(TeamsTab));
