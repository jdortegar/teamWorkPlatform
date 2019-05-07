import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'antd';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { TeamAvatarWrapper } from 'src/containers';
import './styles/style.css';

const propTypes = {
  orgId: PropTypes.string.isRequired,
  publicTeams: PropTypes.array,
  fetchPublicTeams: PropTypes.func.isRequired,
  publicTeamSearch: PropTypes.string
};

const defaultProps = {
  publicTeams: [],
  publicTeamSearch: ''
};

class PublicTeams extends Component {
  state = {
    publicTeamsLoaded: false,
    teamsActive: []
  };

  componentWillMount() {
    const { orgId } = this.props;
    this.props.fetchPublicTeams(orgId).then(() => this.setState({ publicTeamsLoaded: true }));
  }

  componentWillReceiveProps(nextProps) {
    const { publicTeamSearch } = nextProps;
    if (publicTeamSearch === '') {
      this.setState({ teamsActive: [] });
    } else {
      const filteredTeams = this.props.publicTeams.filter(el =>
        el.name.toLowerCase().includes(publicTeamSearch.toLowerCase().trim())
      );
      this.setState({ teamsActive: filteredTeams });
    }
  }

  renderPublicteams = teamsByOrgId =>
    teamsByOrgId.map(team => {
      return (
        <div key={team.teamId} className="habla-left-navigation-team-list">
          <div className="habla-left-navigation-team-list-item">
            <div className="habla-left-navigation-team-list-subitem">
              <TeamAvatarWrapper team={team} size="default" />
              {team.name.length > 20 ? (
                <Tooltip placement="topLeft" title={team.name} arrowPointAtCenter>
                  <span className="habla-left-navigation-item-label">{team.name}</span>
                </Tooltip>
              ) : (
                <span className="habla-left-navigation-item-label">{team.name}</span>
              )}
            </div>
          </div>
        </div>
      );
    });

  render() {
    const { publicTeamsLoaded, teamsActive } = this.state;
    if (teamsActive.length === 0 || !publicTeamsLoaded) {
      return null;
    }

    let teamsByOrgId = teamsActive.sort(sortByName);

    teamsByOrgId = teamsByOrgId.length === 0 && teamsByOrgId[0] === undefined ? [] : primaryAtTop(teamsByOrgId);

    return <div>{this.renderPublicteams(teamsByOrgId)}</div>;
  }
}

PublicTeams.propTypes = propTypes;
PublicTeams.defaultProps = defaultProps;

export default PublicTeams;
