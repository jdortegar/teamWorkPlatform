import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '../../../components/formFields/TextField';
import { createTeamRoom, toggleTeamRoomDialog } from '../../../actions';
import { formShape } from '../../../propTypes';

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
    this.props.form.validateFields((err, name) => {
      if (!err) {
        this.props.createTeamRoom(name, this.props.currentTeamId)
          .then(() => {
            this.props.toggleTeamRoomDialog(false);
          });
      }
    });
  }

  render() {
    return (
      <Modal
        title="Add Team Room"
        cancelText="Cancel"
        okText="Add"
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
            placeholder="Team Room Name"
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
