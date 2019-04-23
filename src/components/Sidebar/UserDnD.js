import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';

import { AvatarWrapper } from 'src/containers';

const propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  conversationId: PropTypes.object.isRequired
};

const defaultProps = {};

export const ItemTypes = {
  FILE: 'file'
};

const UserDnD = ({ connectDropTarget, user, history, conversationId }) => {
  return (
    <div ref={connectDropTarget} key={conversationId} className="habla-left-navigation-team-list-subitem">
      <AvatarWrapper size="default" user={user} />
      <div className="Link__Wrapper" onClick={() => history.push(`/app/chat/${user.userId}`)}>
        <span className="habla-left-navigation-item-label">{user.fullName}</span>
      </div>
    </div>
  );
};

UserDnD.propTypes = propTypes;
UserDnD.defaultProps = defaultProps;

export default DropTarget(
  ItemTypes.FILE,
  {
    drop: props => ({ conversationId: props.conversationId })
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(UserDnD);
