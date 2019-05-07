import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Tooltip } from 'antd';
import { Spinner } from 'src/components';
import { AvatarWrapper } from 'src/containers';
import String from 'src/translations';
import Avatar from '../common/Avatar';
import './styles/style.css';

const propTypes = {
  subscribers: PropTypes.array,
  subscribersPresences: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.object
  }).isRequired,
  userRoles: PropTypes.object,
  fetchTeamMembers: PropTypes.func.isRequired,
  teamId: PropTypes.string.isRequired
};

const defaultProps = {
  subscribers: [],
  subscribersPresences: {},
  userRoles: {}
};

class TeamMembers extends Component {
  state = {
    subscribersLoaded: false
  };

  componentWillMount() {
    const { teamId } = this.props;
    this.props.fetchTeamMembers(teamId).then(() => this.setState({ subscribersLoaded: true }));
  }

  render() {
    const { subscribers, subscribersPresences, userRoles, teamId } = this.props;
    const { subscribersLoaded } = this.state;

    if (!subscribersLoaded) {
      return <Spinner />;
    }

    const teamMembers = [];

    _.forEach(subscribers, subscriber => {
      if (Object.keys(subscriber.teams).some(team => team === teamId)) {
        teamMembers.push({
          ...subscriber,
          online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
        });
      }
    });

    return (
      <div className="sidebar-team-members">
        <div className="sidebar-block-label">
          <span className="habla-label">
            {String.t('teamsMembers')}
            <span className="sidebar-label-number-badge">{teamMembers.length}</span>
          </span>
        </div>
        <div className="sidebar-direct-messages-content">
          {teamMembers.map(subscriber => (
            <AvatarWrapper
              size="default"
              user={subscriber}
              key={subscriber.userId}
              className="mr-05 mb-05"
              hideStatusTooltip
            />
          ))}
          {userRoles && userRoles.teamOwner.includes(teamId) && (
            <Tooltip placement="topLeft" title={String.t('sideBar.invitetoTeam')} arrowPointAtCenter>
              <a>
                <Avatar
                  className="mr-1"
                  onClick={() => {
                    this.props.history.push(`/app/inviteToTeam/${teamId}`);
                  }}
                >
                  +
                </Avatar>
              </a>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}

TeamMembers.propTypes = propTypes;
TeamMembers.defaultProps = defaultProps;

export default TeamMembers;
