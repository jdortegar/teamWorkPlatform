import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';

import { Tooltip } from 'antd';
import { TeamAvatarWrapper } from 'src/containers';

const propTypes = {
  team: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired
};

const defaultProps = {};

export const ItemTypes = {
  FILE: 'file'
};

const TeamDnD = ({ connectDropTarget, team }) => {
  return (
    <div ref={connectDropTarget} className="habla-left-navigation-team-list-subitem">
      <TeamAvatarWrapper team={team} size="default" />
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
