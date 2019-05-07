import React from 'react';
import PropTypes from 'prop-types';

import { Badge } from 'src/components';
import { UserDnD } from 'src/containers';

import './styles/style.css';

const propTypes = {
  user: PropTypes.object.isRequired,
  unreadMessages: PropTypes.number
};

const defaultProps = {
  unreadMessages: 0
};

const DirectMessageItem = ({ user, unreadMessages }) => (
  <div className="habla-left-navigation-team-list">
    <div className="habla-left-navigation-team-list-item">
      <UserDnD user={user} />
      {unreadMessages > 0 && <Badge count={unreadMessages} className="SideBar__Badge" overflowCount={999999} />}
    </div>
  </div>
);

DirectMessageItem.propTypes = propTypes;
DirectMessageItem.defaultProps = defaultProps;

export default DirectMessageItem;
