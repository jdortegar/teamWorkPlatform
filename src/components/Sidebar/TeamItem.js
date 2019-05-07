import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from 'src/components';
import TeamDnD from './TeamDnD';

import './styles/style.css';

const propTypes = {
  team: PropTypes.object.isRequired,
  unreadMessages: PropTypes.number
};

const defaultProps = {
  unreadMessages: 0
};

const TeamItem = ({ team, unreadMessages }) => (
  <div className="habla-left-navigation-team-list">
    <div className="habla-left-navigation-team-list-item">
      <TeamDnD team={team} />
      {unreadMessages > 0 && <Badge count={unreadMessages} className="SideBar__Badge" overflowCount={999999} />}
    </div>
  </div>
);

TeamItem.propTypes = propTypes;
TeamItem.defaultProps = defaultProps;

export default TeamItem;
