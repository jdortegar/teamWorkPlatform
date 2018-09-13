import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SearchPage from 'pages/SearchPage';
import { search, toggleOwnerFilter, toggleIntegrationFilter, toggleFileTypeFilter } from 'actions';
import { getCurrentSubscriberOrgId, getUserById, getSearchKeywords } from 'selectors';

const mapStateToProps = state => ({
  results: state.files.items,
  owners: state.files.owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count })),
  fileTypes: state.files.fileTypes,
  integrations: state.files.integrations,
  excludeFilters: state.files.excludeFilters,
  query: state.search.query,
  loading: state.search.loading,
  caseSensitive: state.search.caseSensitive,
  andOperator: state.search.andOperator,
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
