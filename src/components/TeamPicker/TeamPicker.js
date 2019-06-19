import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import String from 'src/translations';

import 'src/pages/CKGPage/styles/style.css';

const { Option } = Select;

const propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      teamId: PropTypes.string,
      name: PropTypes.string
    })
  ),
  onSelect: PropTypes.func,
  searchAll: PropTypes.bool
};

const defaultProps = {
  teams: [],
  onSelect: null,
  searchAll: false
};

// eslint-disable-next-line react/prefer-stateless-function
class TeamPicker extends React.Component {
  render() {
    const { searchAll, onSelect, teams } = this.props;
    return (
      <div className="team-select-container">
        <Select defaultValue={searchAll ? 'all' : 'org'} className="team-select" onChange={onSelect}>
          <Option value="all" style={{ display: searchAll ? 'block' : 'none' }}>
            {String.t('selectAll')}
          </Option>
          <Option value="org">Organization CKG</Option>
          {teams.map(({ teamId, name }) => (
            <Option key={teamId} value={teamId}>
              {name}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

TeamPicker.propTypes = propTypes;
TeamPicker.defaultProps = defaultProps;

export default TeamPicker;
