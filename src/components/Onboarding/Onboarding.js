import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PersonalizeTeamModal } from 'src/containers';

import './styles/style.css';

class Onboarding extends Component {
  state = { currentStep: 1 };

  handleModalSkip = () => {
    this.setState({ currentStep: this.state.currentStep + 1 });
  };

  render() {
    const { currentStep } = this.state;
    const { visible } = this.props;

    if (!visible || currentStep > 1) return null;

    return (
      <div className="Onboarding">{currentStep === 1 && <PersonalizeTeamModal onCancel={this.handleModalSkip} />}</div>
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
