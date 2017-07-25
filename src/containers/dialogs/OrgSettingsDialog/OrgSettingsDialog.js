import React, { Component } from 'react';
import { Modal, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSubscriberOrg, toggleOrgDialog } from '../../../actions';
import { InvitePeopleTab } from '../../tabs';

const TabPane = Tabs.TabPane;

class OrgSettingsDialog extends Component {
  render() {
    return (
      <Modal
        title="Organization Settings"
        cancelText="Cancel"
        okText="OK"
        visible={false}
        onOk={null}
        afterClose={null}
        onCancel={null}
        width={700}
      >
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          style={{ height: 400 }}
        >
          <TabPane tab="Add Team" key="1">
            <InvitePeopleTab />
          </TabPane>
          <TabPane tab="Invite People" key="2">Content of tab 2</TabPane>
          <TabPane tab="Settings" key="3">Content of tab 3</TabPane>
        </Tabs>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showOrgDialog: state.dialogs.showOrgDialog,
    submittingOrgForm: state.subscriberOrgs.submittingOrgForm
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createSubscriberOrg, toggleOrgDialog }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgSettingsDialog);
