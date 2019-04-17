import { connect } from 'react-redux';
import { deleteMessage, saveBookmark } from 'src/actions';
import { getCurrentUser, getSubscribersOfSubscriberOrgId, getPresencesOfSubscribersOfOrgId } from 'src/selectors';
import { BookmarksPage } from 'src/pages';

const mapStateToProps = state => ({
  user: getCurrentUser(state),
  subscriberOrgs: state.subscriberOrgs,
  subscribers: getSubscribersOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
  subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId)
});

const mapDispatchToProps = { deleteMessage, saveBookmark };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksPage);
