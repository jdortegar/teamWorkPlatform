import { connect } from 'react-redux';
import { FileListView } from 'src/components';
import {
  getOwners,
  getSearchKeywords,
  isSearchCaseSensitive,
  isSearchLoading,
  getAttachedFilesOwners,
  getCurrentUserTeams,
  getCurrentSubscriberOrgName,
  getConversationsById,
  getCurrentUser,
  getOrgSubscribers,
  getMessagesById
} from 'src/selectors';
import { createMessage } from 'src/actions';

const mapStateToProps = (state, props) => {
  const { attachedFilesMode } = props;
  const owners = attachedFilesMode ? getAttachedFilesOwners(state) : getOwners(state);

  return {
    user: getCurrentUser(state),
    users: getOrgSubscribers(state),
    owners,
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    loading: props.loading !== undefined ? props.loading : isSearchLoading(state),
    teams: getCurrentUserTeams(state),
    orgName: getCurrentSubscriberOrgName(state),
    conversationsById: getConversationsById(state),
    messages: getMessagesById(state)
  };
};

const mapDispatchToProps = {
  createMessage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListView);
