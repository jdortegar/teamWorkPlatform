import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from 'src/components';
import TeamDnD from './TeamDnD';

import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  unreadMessages: PropTypes.number,
  unreadMessageId: PropTypes.string,
  history: PropTypes.object.isRequired
};

const defaultProps = {
  unreadMessages: 0,
  unreadMessageId: null
};

const TeamItem = ({ team, unreadMessages, unreadMessageId, history }) => (
  <div
    className="habla-left-navigation-team-list"
    onClick={() => history.push({ pathname: `/app/team/${team.teamId}`, state: { messageId: unreadMessageId } })}
  >
    <div className="habla-left-navigation-team-list-item">
      <TeamDnD team={team} />
      {unreadMessages > 0 && <Badge count={unreadMessages} className="SideBar__Badge" overflowCount={999999} />}
    </div>
  </div>
);

TeamItem.propTypes = propTypes;
TeamItem.defaultProps = defaultProps;

export default TeamItem;
