import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SearchPage from 'pages/SearchPage';
import { search } from 'actions';
import { getCurrentSubscriberOrgId, getUserById, getSearchKeywords } from 'selectors';

const mapStateToProps = state => ({
  owners: state.search.owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count })),
  results: state.search.results,
  query: state.search.query,
  fileTypes: state.search.fileTypes,
  integrations: state.search.integrations,
  loading: state.search.loading,
  caseSensitive: state.search.caseSensitive,
  andOperator: state.search.andOperator,
  keywords: getSearchKeywords(state),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
});

const mapDispatchToProps = { search };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchPage)
);
