import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Row, Col, message } from 'antd';
import uuid from 'uuid/v4';

import String from 'src/translations';
import { Button, EmailField } from 'src/components';
import { formShape } from 'src/propTypes';

const propTypes = {
  form: formShape.isRequired,
  orgId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  inviteNewSubscribers: PropTypes.func.isRequired
};

const MAX_INVITEES = 5;

class InviteTeamMembersModal extends Component {
  state = { submitting: false, invitees: [uuid()] };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { inviteNewSubscribers, orgId, onCancel } = this.props;
        this.setState({ submitting: true });

        inviteNewSubscribers(Object.values(values), orgId)
          .then(() => {
            this.setState({ submitting: false });
            onCancel();
          })
          .catch(error => {
            this.setState({ submitting: false });
            if (error.response && error.response.status === 409) {
              message.error(String.t('inviteNewMemberPage.errorUserhasOtherOrg'));
            } else if (error.response && error.response.status === 403) {
              message.error(String.t('inviteNewMemberPage.errorUserLimit'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  };

  addInvitees = () => {
    this.setState({ invitees: [...this.state.invitees, uuid()] });
  };

  removeInvitee = invitee => {
    const invitees = this.state.invitees.filter(item => item !== invitee);
    this.setState({ invitees });
  };

  renderInvitees = () => {
    const { form } = this.props;
    const { invitees } = this.state;
    const multiple = invitees.length > 1;

    return invitees.map(invitee => (
      <Row key={invitee} type="flex">
        <Col className="gutter-row" span={multiple ? 19 : 24}>
          <EmailField form={form} componentKey={`email-${invitee}`} label="" required />
        </Col>
        {multiple && (
          <Col className="gutter-row" span={5}>
            <Button type="ghost" onClick={() => this.removeInvitee(invitee)} fitText>
              <i className="fa fa-minus-circle margin-right-class-a" />
              Remove
            </Button>
          </Col>
        )}
      </Row>
    ));
  };

  render() {
    const { onCancel } = this.props;
    const { invitees, submitting } = this.state;

    const footer = (
      <div className="Onboarding__footer">
        <Button
          type="primary"
          onClick={this.handleSubmit}
          loading={submitting}
          className="habla-button"
          size="large"
          fitText
        >
          Send Invitations
        </Button>
        <Button type="ghost" onClick={onCancel} fitText>
          Skip Step
        </Button>
      </div>
    );

    return (
      <Modal visible centered closable={false} footer={footer}>
        <div className="Onboarding__title-container">
          <h1 className="Onboarding__title">Invite Team Members</h1>
        </div>
        <div className="Onboarding__content">
          <p className="Onboarding__content-description">
            Invite Team Members to your Organization. Then you will be able to distribute them in different Project
            Teams.
          </p>
          <p className="Onboarding__form-label">User Email</p>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            {this.renderInvitees()}
            {invitees.length < MAX_INVITEES && (
              <div className="inviteMoreUsersLink">
                <a onClick={this.addInvitees} className="Invite-New-Member__add-another">
                  <span>
                    <i className="fa fa-plus-circle margin-right-class-a" />
                    {String.t('inviteNewMemberPage.addEmail')}
                  </span>
                </a>
              </div>
            )}
          </Form>
        </div>
      </Modal>
    );
  }
}

InviteTeamMembersModal.propTypes = propTypes;

export default Form.create()(InviteTeamMembersModal);
