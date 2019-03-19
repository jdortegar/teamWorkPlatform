import { connect } from 'react-redux';

import { getCurrentUser, getCurrentOrgId } from 'src/selectors';
import { Message } from 'src/components';

const mapStateToProps = (state, props) => {
  const currentUser = getCurrentUser(state);
  const orgId = getCurrentOrgId(state);
  const { messageId, createdBy } = props.message;

  const bookmarks = currentUser.bookmarks[orgId];
  const bookmarked = bookmarks && bookmarks.messageIds && bookmarks.messageIds[messageId] !== undefined;
  const ownMessage = currentUser.userId === createdBy;

  return {
    ownMessage,
    bookmarked
  };
};

export default connect(mapStateToProps)(Message);
