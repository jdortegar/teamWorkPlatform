import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PersonalizeTeamModal, InviteTeamMembersModal, AddTeamIntegrationModal } from 'src/containers';

import './styles/style.css';

const TOTAL_STEPS = 3;
const PERSONALIZE_TEAM = 1;
const INVITE_MEMBERS = 2;
const ADD_INTEGRATIONS = 3;

class Onboarding extends Component {
  state = { currentStep: 0 };

  componentDidMount() {
    if (this.props.team) this.setFirstStep();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.team && nextProps.team) this.setFirstStep();
  }

  setFirstStep = () => {
    const currentStep = this.props.userRoles.admin ? PERSONALIZE_TEAM : ADD_INTEGRATIONS;
    this.setState({ currentStep });
  };

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
        {currentStep === PERSONALIZE_TEAM && <PersonalizeTeamModal onCancel={this.handleModalSkip} />}
        {currentStep === INVITE_MEMBERS && <InviteTeamMembersModal onCancel={this.handleModalSkip} />}
        {currentStep === ADD_INTEGRATIONS && <AddTeamIntegrationModal onCancel={this.handleModalSkip} />}
      </div>
    );
  }
}

Onboarding.propTypes = {
  team: PropTypes.object,
  user: PropTypes.object.isRequired,
  userRoles: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
  updateUser: PropTypes.func.isRequired
};

Onboarding.defaultProps = {
  team: null
};

export default Onboarding;
