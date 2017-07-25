import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/Header';
import Sidebar from '../../containers/Sidebar';
import MainContent from '../../components/MainContent';
import { AddOrgDialog } from '../../containers/dialogs';
import { requestSubscriberOrgs, requestAllTeams } from '../../actions';
import './styles/main.css';
import '../styles/habla-brand-styles.css';

class Main extends Component {
  componentDidMount() {
    this.props.requestSubscriberOrgs();
    this.props.requestAllTeams();
  }

  render() {
    return (
      <Layout>
        <Header />
        <Layout className="ant-layout-has-sider">
          <Sidebar />
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb separator=">" style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>Organization Name</Breadcrumb.Item>
              <Breadcrumb.Item>Team Name</Breadcrumb.Item>
              <Breadcrumb.Item>Team Room Name</Breadcrumb.Item>
            </Breadcrumb>
            <MainContent />
            <AddOrgDialog />
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ requestSubscriberOrgs, requestAllTeams }, dispatch);
}

export default connect(null, mapDispatchToProps)(Main);
