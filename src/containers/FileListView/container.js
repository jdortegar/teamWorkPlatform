import { connect } from 'react-redux';
import { FileListView } from 'src/components';
import {
  getOwners,
  getSearchKeywords,
  isSearchCaseSensitive,
  isSearchLoading,
  getAttachedFilesOwners,
  getCurrentUserTeams,
  getCurrentSubscriberOrgName
} from 'src/selectors';
import { createMessage } from 'src/actions';

const mapStateToProps = (state, props) => {
  const { attachedFilesMode } = props;
  const owners = attachedFilesMode ? getAttachedFilesOwners(state) : getOwners(state);

  return {
    owners,
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    loading: props.loading !== undefined ? props.loading : isSearchLoading(state),
    teams: getCurrentUserTeams(state),
    orgName: getCurrentSubscriberOrgName(state)
  };
};

const mapDispatchToProps = {
  createMessage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListView);
