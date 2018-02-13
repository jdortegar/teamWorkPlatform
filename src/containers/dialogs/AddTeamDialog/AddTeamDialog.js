import React, { Component } from 'react';
import { Form, Modal, notification } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '../../../components/formFields/TextField';
import { createTeam, toggleTeamDialog } from '../../../actions';
import { formShape } from '../../../propTypes';
import String from '../../../translations';

const propTypes = {
  form: formShape.isRequired,
  createTeam: PropTypes.func.isRequired,
  toggleTeamDialog: PropTypes.func.isRequired,
  submittingTeamForm: PropTypes.bool.isRequired,
  showTeamDialog: PropTypes.bool.isRequired,
  currentOrgId: PropTypes.string
};

const defaultProps = {
  currentOrgId: null
};

class AddTeamDialog extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  hideDialog() {
    this.props.toggleTeamDialog(false);
  }

  resetForm() {
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, name) => {
      if (!err) {
        this.props.createTeam(name, this.props.currentOrgId)
          .then(() => {
            this.props.toggleTeamDialog(false);
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
        title={String.t('addTeamDialog.title')}
        cancelText={String.t('cancelButton')}
        okText={String.t('addTeamDialog.addButtonLabel')}
        visible={this.props.showTeamDialog}
        onOk={this.handleSubmit}
        confirmLoading={this.props.submittingTeamForm}
        afterClose={this.resetForm}
        onCancel={this.hideDialog}
      >
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <TextField
            form={this.props.form}
            required
            label=""
            componentKey="name"
            placeholder={String.t('addTeamDialog.namePlaceholder')}
          />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showTeamDialog: state.dialogs.showTeamDialog,
    submittingTeamForm: state.dialogs.submittingTeamForm,
    currentOrgId: state.dialogs.currentOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createTeam, toggleTeamDialog }, dispatch);
}

AddTeamDialog.propTypes = propTypes;
AddTeamDialog.defaultProps = defaultProps;

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddTeamDialog));
