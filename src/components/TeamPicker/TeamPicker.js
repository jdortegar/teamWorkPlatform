import React from 'react';
import PropTypes from 'prop-types';

import 'pages/CKGPage/styles/style.css';

const propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      teamId: PropTypes.string,
      name: PropTypes.string
    })
  ),
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

const defaultProps = {
  teams: [],
  selected: '',
  onSelect: null
};

const TeamPicker = ({ teams, selected, onSelect }) => (
  <div className="team-select-container">
    <select className="team-select" onChange={onSelect} value={selected}>
      {teams.map(({ teamId, name }) => (
        <option key={teamId} value={teamId}>
          {name}
        </option>
      ))}
    </select>
  </div>
);

TeamPicker.propTypes = propTypes;
TeamPicker.defaultProps = defaultProps;

export default TeamPicker;
