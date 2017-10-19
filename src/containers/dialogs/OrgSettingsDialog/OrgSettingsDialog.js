import React, { Component } from 'react';
import { Modal, Tabs } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleOrgSettingsDialog } from '../../../actions';
import './styles/style.css';

const TabPane = Tabs.TabPane;

const propTypes = {
  orgSettingsDialog: PropTypes.object.isRequired,
  toggleOrgSettingsDialog: PropTypes.func.isRequired
};

class OrgSettingsDialog extends Component {
  constructor(props) {
    super(props);

    this.hideDialog = this.hideDialog.bind(this);
  }

  hideDialog() {
    this.props.toggleOrgSettingsDialog(false, null);
  }

  render() {
    return (
      <Modal
        title="Organization Settings"
        cancelText="Cancel"
        okText="OK"
        visible={this.props.orgSettingsDialog.show}
        onOk={null}
        afterClose={null}
        onCancel={this.hideDialog}
        width={900}
        className="org-settings-modal"
      >
        <Tabs
          defaultActiveKey="teams"
          tabPosition="left"
          style={{ height: 400 }}
        >
          <TabPane tab="Team Rooms" key="teamRooms">
            Team Rooms
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showOrgDialog: state.dialogs.showOrgDialog,
    submittingOrgForm: state.subscriberOrgs.submittingOrgForm,
    orgSettingsDialog: state.dialogs.orgSettingsDialog
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleOrgSettingsDialog }, dispatch);
}

OrgSettingsDialog.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(OrgSettingsDialog);
