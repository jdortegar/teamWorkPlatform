import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PersonalizeTeamModal, InviteTeamMembersModal, AddTeamIntegrationModal } from 'src/containers';

import './styles/style.css';

const TOTAL_STEPS = 3;
const PERSONALIZE_TEAM = 1;
const INVITE_MEMBERS = 2;
const ADD_INTEGRATIONS = 3;

class Onboarding extends Component {
  state = { currentStep: 1 };

  handleModalSkip = () => {
    const { user, updateUser, isAdmin } = this.props;

    const currentStep = isAdmin ? this.state.currentStep + 1 : this.state.currentStep + 2;

    this.setState({ currentStep }, () => {
      if (this.state.currentStep > TOTAL_STEPS) {
        updateUser({ onboarding: false }, user.userId);
      }
    });
  };

  render() {
    const { currentStep } = this.state;
    const { user } = this.props;

    if (!user.onboarding || currentStep > TOTAL_STEPS) return null;

    return (
      <div className="Onboarding">
        {currentStep === PERSONALIZE_TEAM && <PersonalizeTeamModal onCancel={this.handleModalSkip} />}
        {currentStep === INVITE_MEMBERS && <InviteTeamMembersModal onCancel={this.handleModalSkip} />}
        {currentStep === ADD_INTEGRATIONS && <AddTeamIntegrationModal onCancel={this.handleModalSkip} />}
      </div>
    );
  }
}

Onboarding.propTypes = {
  user: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired
};

export default Onboarding;
