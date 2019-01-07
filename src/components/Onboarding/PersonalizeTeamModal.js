import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'antd';

import { Button, TextField } from 'src/components';
import { formShape } from 'src/propTypes';

const propTypes = {
  form: formShape.isRequired,
  team: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired
};

class PersonalizeTeamModal extends Component {
  state = { submitting: false };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { updateTeam, team, orgId, onCancel } = this.props;
        this.setState({ submitting: true });

        updateTeam(orgId, team.teamId, values)
          .then(() => {
            this.setState({ submitting: false });
            onCancel();
          })
          .catch(() => this.setState({ submitting: false }));
      }
    });
  };

  render() {
    const { form, team, onCancel } = this.props;
    const { submitting } = this.state;

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
          Save
        </Button>
        <Button type="ghost" onClick={onCancel} fitText>
          Skip Step
        </Button>
      </div>
    );

    return (
      <Modal visible centered closable={false} footer={footer}>
        <div className="Onboarding__title-container">
          <h1 className="Onboarding__title">Personalize your Project Team</h1>
        </div>
        <div className="Onboarding__content">
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <TextField form={form} label="Project Team Name" componentKey="name" initialValue={team.name} required />
          </Form>
        </div>
      </Modal>
    );
  }
}

PersonalizeTeamModal.propTypes = propTypes;

export default Form.create()(PersonalizeTeamModal);
