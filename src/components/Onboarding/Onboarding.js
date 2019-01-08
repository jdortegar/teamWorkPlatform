import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PersonalizeTeamModal, InviteTeamMembersModal, AddTeamIntegrationModal } from 'src/containers';

import './styles/style.css';

const TOTAL_STEPS = 3;

class Onboarding extends Component {
  state = { currentStep: 1 };

  handleModalSkip = () => {
    const { user, updateUser } = this.props;
    this.setState({ currentStep: this.state.currentStep + 1 }, () => {
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
        {currentStep === 1 && <PersonalizeTeamModal onCancel={this.handleModalSkip} />}
        {currentStep === 2 && <InviteTeamMembersModal onCancel={this.handleModalSkip} />}
        {currentStep === 3 && <AddTeamIntegrationModal onCancel={this.handleModalSkip} />}
      </div>
    );
  }
}

Onboarding.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func.isRequired
};

Onboarding.defaultProps = {
  user: {}
};

export default Onboarding;
