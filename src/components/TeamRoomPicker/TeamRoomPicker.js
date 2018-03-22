import React from 'react';
import PropTypes from 'prop-types';

import 'pages/CKGPage/styles/style.css';

const propTypes = {
  teamRooms: PropTypes.arrayOf(PropTypes.shape({
    teamRoomId: PropTypes.string,
    name: PropTypes.string
  })),
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

const defaultProps = {
  teamRooms: [],
  selected: '',
  onSelect: null
};

const TeamRoomPicker = ({ teamRooms, selected, onSelect }) => (
  <div className="team-room-select-container">
    <select
      className="team-room-select"
      onChange={onSelect}
      value={selected}
    >
      {teamRooms.map(({ teamRoomId, name }) => (
        <option key={teamRoomId} value={teamRoomId}>
          {name}
        </option>
      ))}
    </select>
  </div>
);

TeamRoomPicker.propTypes = propTypes;
TeamRoomPicker.defaultProps = defaultProps;

export default TeamRoomPicker;
