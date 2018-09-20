import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { SearchPage } from 'src/pages';
import { search, toggleOwnerFilter, toggleIntegrationFilter, toggleFileTypeFilter } from 'src/actions';
import {
  getCurrentSubscriberOrgId,
  getUserById,
  getSearchKeywords,
  getSearchQuery,
  isSearchLoading,
  isSearchCaseSensitive,
  hasSearchAndOperator
} from 'src/selectors';

const mapStateToProps = state => ({
  results: state.files.items,
  owners: state.files.owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count })),
  fileTypes: state.files.fileTypes,
  integrations: state.files.integrations,
  excludeFilters: state.files.excludeFilters,
  query: getSearchQuery(state),
  loading: isSearchLoading(state),
  caseSensitive: isSearchCaseSensitive(state),
  andOperator: hasSearchAndOperator(state),
  keywords: getSearchKeywords(state),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
});

const mapDispatchToProps = {
  search,
  toggleOwnerFilter,
  toggleIntegrationFilter,
  toggleFileTypeFilter
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchPage)
);
