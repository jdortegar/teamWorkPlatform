import React, { Component } from 'react';
import { Form, Modal, notification } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '../../../components/formFields/TextField';
import { createSubscriberOrgFromDialog, toggleOrgDialog } from '../../../actions';
import { formShape } from '../../../propTypes';
import String from '../../../translations';

const propTypes = {
  form: formShape.isRequired,
  createSubscriberOrgFromDialog: PropTypes.func.isRequired,
  toggleOrgDialog: PropTypes.func.isRequired,
  submittingOrgForm: PropTypes.bool.isRequired,
  showOrgDialog: PropTypes.bool.isRequired
};

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
        this.props.createSubscriberOrgFromDialog(name)
          .then(() => {
            this.props.toggleOrgDialog(false);
          })
          .catch((error) => {
            notification.open({
              message: String.t('errorToastTitle'),
              description: error.message,
              duration: 4
            });
          });
      }
    });
  }

  render() {
    return (
      <Modal
        title={String.t('addOrgDialog.title')}
        cancelText={String.t('cancelButton')}
        okText={String.t('addOrgDialog.addButtonLabel')}
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
            placeholder={String.t('addOrgDialog.namePlaceholder')}
          />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showOrgDialog: state.dialogs.showOrgDialog,
    submittingOrgForm: state.dialogs.submittingOrgForm
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createSubscriberOrgFromDialog, toggleOrgDialog }, dispatch);
}

AddOrgDialog.propTypes = propTypes;

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddOrgDialog));
