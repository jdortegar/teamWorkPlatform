import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, message } from 'antd';

import String from 'src/translations';
import { Button, TextField } from 'src/components';
import { formShape } from 'src/propTypes';

const propTypes = {
  form: formShape.isRequired,
  team: PropTypes.object,
  orgId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired
};

const defaultProps = {
  team: null
};

class PersonalizeTeamModal extends Component {
  state = { submitting: false };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { updateTeam, team, orgId, onCancel } = this.props;
        this.setState({ submitting: true });

        if (team.name.trim() === values.name.trim()) {
          this.setState({ submitting: false });
          onCancel();
          return;
        }

        updateTeam(orgId, team.teamId, values)
          .then(() => {
            this.setState({ submitting: false });
            onCancel();
          })
          .catch(error => {
            this.setState({ submitting: false });
            if (error.response && error.response.status === 409) {
              message.error(String.t('editTeamPage.errorNameAlreadyTaken'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  };

  render() {
    const { form, team, onCancel } = this.props;
    const { submitting } = this.state;

    if (!team) return null;

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
          {String.t('onboarding.saveButton')}
        </Button>
        <Button type="ghost" onClick={onCancel} fitText>
          {String.t('onboarding.skipButton')}
        </Button>
      </div>
    );

    return (
      <Modal visible centered closable={false} footer={footer}>
        <div className="Onboarding__title-container">
          <h1 className="Onboarding__title">{String.t('onboarding.personalizeTeamModalTitle')}</h1>
        </div>
        <div className="Onboarding__content">
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <TextField form={form} label="Team Name" componentKey="name" initialValue={team.name} required />
          </Form>
        </div>
      </Modal>
    );
  }
}

PersonalizeTeamModal.propTypes = propTypes;
PersonalizeTeamModal.defaultProps = defaultProps;

export default Form.create()(PersonalizeTeamModal);
