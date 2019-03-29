import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getCurrentUser, getCurrentOrgId, getUserById } from 'src/selectors';
import { Message } from 'src/components';
import { makePersonalCall } from 'src/actions';

const mapStateToProps = (state, props) => {
  const currentUser = getCurrentUser(state);
  const orgId = getCurrentOrgId(state);
  const { messageId, createdBy, sharedProfileId } = props.message;

  const bookmarks = currentUser.bookmarks[orgId];
  const bookmarked = bookmarks && bookmarks.messageIds && bookmarks.messageIds[messageId] !== undefined;
  const ownMessage = currentUser.userId === createdBy;

  return {
    ownMessage,
    bookmarked,
    sharedProfile: getUserById(state, sharedProfileId),
    currentUser
  };
};

const mapDispatchToProps = {
  makePersonalCall
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Message)
);
