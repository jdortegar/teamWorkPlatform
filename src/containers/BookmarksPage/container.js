import { connect } from 'react-redux';
import { fetchBookmarks, deleteMessage } from 'src/actions';
import { getBookmarks, getOrgSubscribers } from 'src/selectors';
import { BookmarksPage } from 'src/pages';

const mapStateToProps = state => ({
  bookmarks: getBookmarks(state),
  subscribers: getOrgSubscribers(state)
});

const mapDispatchToProps = { fetchBookmarks, deleteMessage };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksPage);
