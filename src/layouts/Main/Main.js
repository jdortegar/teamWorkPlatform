import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import Header from 'containers/Header';
import Sidebar from 'containers/Sidebar';
import MainContent from 'containers/MainContent';
import {
  AddTeamDialog,
  AddTeamRoomDialog
} from 'containers/dialogs';
import './styles/main.css';

const propTypes = {
  initMessaging: PropTypes.func.isRequired,
  closeMessaging: PropTypes.func.isRequired,
  fetchGlobalState: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.object.isRequired
};

class Main extends React.Component {
  componentDidMount() {
    this.props.fetchGlobalState();
    this.props.initMessaging();
    window.addEventListener('beforeunload', this.onUnload);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subscriberOrgs.currentSubscriberOrgId !== nextProps.subscriberOrgs.currentSubscriberOrgId) {
      this.props.fetchGlobalState();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  onUnload = () => {
    this.props.closeMessaging();
  }

  render() {
    return (
      <Layout>
        <Header />
        <Layout className="ant-layout-has-sider">
          <Sidebar />
          <Layout className="habla-main-content">
            <MainContent />
            <AddTeamDialog />
            <AddTeamRoomDialog />
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = propTypes;

export default Main;
