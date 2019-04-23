import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';

import getInitials from 'src/utils/helpers';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import Avatar from '../common/Avatar';

const propTypes = {
  team: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired
};

const defaultProps = {};

export const ItemTypes = {
  FILE: 'file'
};

function renderAvatar(item, enabled) {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': !enabled
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} />;
  }
  const nameInitial = getInitials(item.name);
  return (
    <Avatar color={preferences.iconColor} className={className}>
      {nameInitial}
    </Avatar>
  );
}

const TeamDnD = ({ connectDropTarget, team }) => {
  return (
    <div ref={connectDropTarget} className="habla-left-navigation-team-list-subitem">
      {renderAvatar(team, team.active)}
      {team.name.length > 20 ? (
        <Tooltip placement="topLeft" title={team.name} arrowPointAtCenter>
          <span className="habla-left-navigation-item-label">{team.name}</span>
        </Tooltip>
      ) : (
        <span className="habla-left-navigation-item-label">{team.name}</span>
      )}
    </div>
  );
};

TeamDnD.propTypes = propTypes;
TeamDnD.defaultProps = defaultProps;

export default DropTarget(
  ItemTypes.FILE,
  {
    drop: props => ({ conversationId: props.team.conversationId })
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(TeamDnD);
