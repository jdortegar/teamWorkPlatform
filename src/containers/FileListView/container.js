import { connect } from 'react-redux';
import { FileListView } from 'src/components';
import { getOwners, getSearchKeywords, isSearchCaseSensitive, isSearchLoading } from 'src/selectors';

const mapStateToProps = state => ({
  owners: getOwners(state),
  keywords: getSearchKeywords(state),
  caseSensitive: isSearchCaseSensitive(state),
  loading: isSearchLoading(state)
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListView);
