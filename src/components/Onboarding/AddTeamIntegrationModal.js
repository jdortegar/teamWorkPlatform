import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import { Button, IntegrationsList } from 'src/components';

const propTypes = {
  team: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired
};

const AddTeamIntegrationModal = ({ team, onCancel }) => {
  const footer = (
    <div className="Onboarding__footer last">
      <Button type="ghost" onClick={onCancel} fitText>
        Skip Step
      </Button>
    </div>
  );

  return (
    <Modal visible centered closable={false} footer={footer} width={410}>
      <div className="Onboarding__title-container">
        <h1 className="Onboarding__title">Add a Data Integration</h1>
      </div>
      <div className="Onboarding__content">
        <IntegrationsList teamId={team.teamId} hideInactive />
      </div>
    </Modal>
  );
};

AddTeamIntegrationModal.propTypes = propTypes;

export default AddTeamIntegrationModal;
