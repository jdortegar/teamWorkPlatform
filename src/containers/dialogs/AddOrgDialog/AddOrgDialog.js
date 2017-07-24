import React, { Component } from 'react';
import { Form } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import TextField from '../../../components/formFields/TextField';
import { createSubscriberOrg, toggleOrgDialog } from '../../../actions';

class AddOrgDialog extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  hideDialog() {
    this.props.toggleOrgDialog(false);
  }

  resetForm() {
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, name) => {
      if (!err) {
        this.props.createSubscriberOrg(name)
        .then(() => {
          this.props.toggleOrgDialog(false);
        });
      }
    });
  }

  render() {
    return (
      <Modal
        title="Add Organization"
        cancelText="Cancel"
        okText="Add"
        visible={this.props.showOrgDialog}
        onOk={this.handleSubmit}
        confirmLoading={this.props.submittingOrgForm}
        afterClose={this.resetForm}
        onCancel={this.hideDialog}
      >
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <TextField
            form={this.props.form}
            required
            label=""
            componentKey="name"
            placeholder="Organization Name"
          />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showOrgDialog: state.dialogs.showOrgDialog,
    submittingOrgForm: state.subscriberOrgs.submittingOrgForm
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createSubscriberOrg, toggleOrgDialog }, dispatch);
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddOrgDialog));
