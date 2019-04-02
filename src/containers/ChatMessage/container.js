import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getCurrentUser, getCurrentOrgId, getUserById } from 'src/selectors';
import { ChatMessage } from 'src/components';
import { makePersonalCall, fetchMetadata } from 'src/actions';

const mapStateToProps = (state, props) => {
  const currentUser = getCurrentUser(state);
  const orgId = getCurrentOrgId(state);
  const { messageId, createdBy, sharedProfileId } = props.message;

  const bookmarks = currentUser.bookmarks[orgId];
  const bookmarked = bookmarks && bookmarks.messageIds && bookmarks.messageIds[messageId] !== undefined;
  const sender = getUserById(state, createdBy);
  const ownMessage = currentUser.userId === createdBy;

  return {
    ownMessage,
    bookmarked,
    sharedProfile: getUserById(state, sharedProfileId),
    currentUser,
    sender
  };
};

const mapDispatchToProps = {
  makePersonalCall,
  fetchMetadata
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChatMessage)
);
