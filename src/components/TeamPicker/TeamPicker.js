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
  query: PropTypes.string,
  elementSelected: PropTypes.string.isRequired,
  queryOption: PropTypes.bool
};

const defaultProps = {
  teams: [],
  onSelect: null,
  query: '',
  queryOption: true
};

// eslint-disable-next-line react/prefer-stateless-function
class TeamPicker extends React.Component {
  render() {
    const { query, onSelect, teams, elementSelected, queryOption } = this.props;
    return (
      <div className="team-select-container">
        {queryOption ? (
          <Select
            defaultValue={query.length > 0 ? 'all' : 'org'}
            value={elementSelected}
            className="team-select"
            onChange={onSelect}
          >
            <Option value="all" style={{ display: query.length > 0 ? 'block' : 'none' }}>
              {String.t('allTeamData')}
            </Option>
            <Option value="org">Organization CKG</Option>
            {teams.map(team => (
              <Option key={team.teamId} value={team.teamId}>
                {team.name}
              </Option>
            ))}
          </Select>
        ) : (
          <Select defaultValue="all" value={elementSelected} className="team-select" onChange={onSelect}>
            <Option value="all">All Messages</Option>
            {teams.map(team => (
              <Option key={team.teamId} value={team.teamId}>
                {team.name}
              </Option>
            ))}
          </Select>
        )}
      </div>
    );
  }
}

TeamPicker.propTypes = propTypes;
TeamPicker.defaultProps = defaultProps;

export default TeamPicker;
