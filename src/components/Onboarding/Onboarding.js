import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PersonalizeTeamModal, InviteTeamMembersModal, AddTeamIntegrationModal } from 'src/containers';

import './styles/style.css';

const TOTAL_STEPS = 3;

class Onboarding extends Component {
  state = { currentStep: 1 };

  handleModalSkip = () => {
    this.setState({ currentStep: this.state.currentStep + 1 });
  };

  render() {
    const { currentStep } = this.state;
    const { visible } = this.props;

    if (!visible || currentStep > TOTAL_STEPS) return null;

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
  visible: PropTypes.bool
};

Onboarding.defaultProps = {
  visible: false
};

export default Onboarding;
