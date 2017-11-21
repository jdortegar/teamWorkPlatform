import React, { Component } from 'react';
import { Col, Row, Form, Modal, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'lodash';
import EmailField from '../../../components/formFields/EmailField';
import { toggleInvitePeopleDialog, submitInviteOrgForm } from '../../../actions';
import { formShape } from '../../../propTypes';
import config from '../../../config/env';
import { getJwt } from '../../../session';
import './styles/style.css';
import String from '../../../translations';

const propTypes = {
  form: formShape.isRequired,
  toggleInvitePeopleDialog: PropTypes.func.isRequired,
  submitInviteOrgForm: PropTypes.func.isRequired,
  submittingInviteOrgForm: PropTypes.bool.isRequired,
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
    this.setState({ invitees: 0, inviteesArr: [0] });
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, emails) => {
      if (!err) {
        const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
        const users = _.values(emails);
        const { currentInviteSubscriberOrg } = this.props;

        this.props.submitInviteOrgForm(true);

        axios.post(
          `${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${currentInviteSubscriberOrg}`,
          { userIdOrEmails: users },
          axiosOptions)
          .then(() => {
            this.props.submitInviteOrgForm(false);
            this.hideDialog();
          });
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
                <a onClick={() => this.removeInvitees(el)} className="remove-field">{String.t('invitePeopleDialog.removeLink')}</a>
              </Col> : null
          }
        </Row>
      );
    });
  }

  render() {
    return (
      <Modal
        title={String.t('invitePeopleDialog.title')}
        cancelText={String.t('cancelButton')}
        okText={String.t('inviteMembersSendInvitesButton', { count: this.state.inviteesArr.length })}
        visible={this.props.showInvitePeopleDialog}
        onOk={this.handleSubmit}
        confirmLoading={this.props.submittingInviteOrgForm}
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
  return bindActionCreators({ toggleInvitePeopleDialog, submitInviteOrgForm }, dispatch);
}

InvitePeopleDialog.propTypes = propTypes;
InvitePeopleDialog.defaultProps = defaultProps;

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(InvitePeopleDialog));
