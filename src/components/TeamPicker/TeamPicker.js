import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import 'src/pages/CKGPage/styles/style.css';

const { Option } = Select;

const propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      teamId: PropTypes.string,
      name: PropTypes.string
    })
  ),
  onSelect: PropTypes.func
};

const defaultProps = {
  teams: [],
  onSelect: null
};

const TeamPicker = ({ teams, onSelect }) => (
  <div className="team-select-container">
    <Select defaultValue="org" className="team-select" onChange={onSelect}>
      <Option value="org">Organization CKG</Option>
      {teams.map(({ teamId, name }) => (
        <Option key={teamId} value={teamId}>
          {name}
        </Option>
      ))}
    </Select>
  </div>
);

TeamPicker.propTypes = propTypes;
TeamPicker.defaultProps = defaultProps;

export default TeamPicker;
