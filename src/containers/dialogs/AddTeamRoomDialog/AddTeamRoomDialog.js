import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '../../../components/formFields/TextField';
import { createTeamRoom, toggleTeamRoomDialog } from '../../../actions';
import { formShape } from '../../../propTypes';
import String from '../../../translations';

const propTypes = {
  form: formShape.isRequired,
  createTeamRoom: PropTypes.func.isRequired,
  toggleTeamRoomDialog: PropTypes.func.isRequired,
  submittingTeamRoomForm: PropTypes.bool.isRequired,
  showTeamRoomDialog: PropTypes.bool.isRequired,
  currentTeamId: PropTypes.string
};

const defaultProps = {
  currentTeamId: null
};

class AddTeamRoomDialog extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  hideDialog() {
    this.props.toggleTeamRoomDialog(false);
  }

  resetForm() {
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.createTeamRoom({ name: values.name, publish: true, active: true }, this.props.currentTeamId)
          .then(() => {
            this.props.toggleTeamRoomDialog(false);
          });
      }
    });
  }

  render() {
    return (
      <Modal
        title={String.t('addTeamRoomDialog.title')}
        cancelText={String.t('cancelButton')}
        okText={String.t('addTeamRoomDialog.addButtonLabel')}
        visible={this.props.showTeamRoomDialog}
        onOk={this.handleSubmit}
        confirmLoading={this.props.submittingTeamRoomForm}
        afterClose={this.resetForm}
        onCancel={this.hideDialog}
      >
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <TextField
            form={this.props.form}
            required
            label=""
            componentKey="name"
            placeholder={String.t('addTeamRoomDialog.namePlaceholder')}
          />
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showTeamRoomDialog: state.dialogs.showTeamRoomDialog,
    submittingTeamRoomForm: state.dialogs.submittingTeamRoomForm,
    currentTeamId: state.dialogs.currentTeamId
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createTeamRoom, toggleTeamRoomDialog }, dispatch);
}

AddTeamRoomDialog.propTypes = propTypes;
AddTeamRoomDialog.defaultProps = defaultProps;

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddTeamRoomDialog));
