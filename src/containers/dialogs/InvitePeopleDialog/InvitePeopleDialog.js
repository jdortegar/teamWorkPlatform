import React, { Component } from 'react';
import { Col, Row, Form, Modal, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import EmailField from '../../../components/formFields/EmailField';
import { toggleInvitePeopleDialog, inviteUser } from '../../../actions';
import { formShape } from '../../../propTypes';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  inviteUser: PropTypes.func.isRequired,
  toggleInvitePeopleDialog: PropTypes.func.isRequired,
  submittingOrgForm: PropTypes.bool.isRequired,
  showInvitePeopleDialog: PropTypes.bool.isRequired,
  currentInviteSubscriberOrg: PropTypes.string
};

const defaultProps = {
  currentInviteSubscriberOrg: null
};

class InvitePeopleDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { invitees: 0, inviteesArr: [0] };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.addInvitees = this.addInvitees.bind(this);
    this.removeInvitees = this.removeInvitees.bind(this);
  }

  addInvitees() {
    if (this.state.invitees < 5) {
      this.setState(previousState => ({ invitees: previousState.invitees + 1, inviteesArr: [...previousState.inviteesArr, previousState.invitees + 1] }));
    }
  }

  removeInvitees(field) {
    const updatedInvitees = this.state.inviteesArr.filter((el) => {
      return el !== field;
    });

    this.setState({ inviteesArr: updatedInvitees });
  }

  hideDialog() {
    this.props.toggleInvitePeopleDialog(false);
  }

  resetForm() {
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, emails) => {
      if (!err) {
        const users = _.values(emails);
        this.props.inviteUser(users, this.props.currentInviteSubscriberOrg);
      }
    });
  }

  renderChildren() {
    return this.state.inviteesArr.map((el) => {
      return (
        <Row key={el} gutter={16} type="flex" align="middle">
          <Col className="gutter-row" span={20}>
            <EmailField
              form={this.props.form}
              required
              componentKey={`email${el}`}
            />
          </Col>
          {
            this.state.inviteesArr.length > 1 ?
              <Col className="gutter-row" span={3}>
                <a onClick={() => this.removeInvitees(el)} className="remove-field">Remove</a>
              </Col> : null
          }
        </Row>
      );
    });
  }

  render() {
    return (
      <Modal
        title="Invite People"
        cancelText="Cancel"
        okText="Send Invitations"
        visible={this.props.showInvitePeopleDialog}
        onOk={this.handleSubmit}
        confirmLoading={this.props.submittingOrgForm}
        afterClose={this.resetForm}
        onCancel={this.hideDialog}
      >
        <Form onSubmit={this.handleSubmit} layout="vertical">
          { this.renderChildren() }
          <a onClick={this.addInvitees}><span><Icon type="plus" />Add another</span></a>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showInvitePeopleDialog: state.dialogs.showInvitePeopleDialog,
    currentInviteSubscriberOrg: state.dialogs.currentInviteSubscriberOrg,
    submittingInviteOrgForm: state.dialogs.submittingInviteOrgForm
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleInvitePeopleDialog, inviteUser }, dispatch);
}

InvitePeopleDialog.propTypes = propTypes;
InvitePeopleDialog.defaultProps = defaultProps;

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(InvitePeopleDialog));
