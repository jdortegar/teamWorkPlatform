import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getCurrentUser, getCurrentOrgId, getUserById, getUserRoles, getUserByUserId } from 'src/selectors';
import { ChatMessage } from 'src/components';
import { makePersonalCall, fetchMetadata, createMessage, deleteMessage } from 'src/actions';

const mapStateToProps = (state, props) => {
  const currentUser = getCurrentUser(state);
  const orgId = getCurrentOrgId(state);
  const { id, createdBy, content } = props.message;
  const [mainContent = {}] = content;
  const bookmarks = currentUser.bookmarks[orgId];
  const bookmarked = bookmarks && bookmarks.messageIds && bookmarks.messageIds[id] !== undefined;
  const ownMessage = currentUser.userId === createdBy;
  const sharedProfileId = mainContent && mainContent.type === 'userId' ? mainContent.text : null;
  const shareDataOwnerId =
    mainContent && mainContent.type === 'sharedData' && mainContent.sharedData
      ? mainContent.sharedData.createdBy
      : null;
  const createdId = createdBy || currentUser.userId;
  return {
    ownMessage,
    bookmarked,
    sharedProfile: getUserById(state, sharedProfileId),
    sender: getUserById(state, createdId),
    shareDataOwner: getUserById(state, shareDataOwnerId),
    currentUser,
    userRoles: getUserRoles(state),
    users: getUserByUserId(state)
  };
};

const mapDispatchToProps = {
  makePersonalCall,
  fetchMetadata,
  createMessage,
  deleteMessage
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChatMessage)
);
