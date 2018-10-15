import { connect } from 'react-redux';
import { deleteMessage, saveBookmark } from 'src/actions';
import { getCurrentUser, getSubscribersOfSubscriberOrgId, getPresencesOfSubscribersOfOrgId } from 'src/selectors';
import { BookmarksPage } from 'src/pages';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    subscriberOrgs: state.subscriberOrgs,
    subscribers: getSubscribersOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteMessage: (message, conversationId) => dispatch(deleteMessage(message, conversationId)),
    saveBookmark: (user, subscriberOrgId, message, setBookmark) =>
      dispatch(saveBookmark(user, subscriberOrgId, message, setBookmark))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksPage);
