import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SearchPage from 'pages/SearchPage';
import { search } from 'actions';
import { getCurrentSubscriberOrgId, getUserById } from 'selectors';
import { extractQueryParams } from 'routes';

const mapStateToProps = (state, props) => ({
  owners: state.search.owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count })),
  results: state.search.results,
  query: state.search.query,
  fileTypes: state.search.fileTypes,
  integrations: state.search.integrations,
  loading: state.search.loading,
  queryParams: extractQueryParams(props),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
});

const mapDispatchToProps = dispatch => ({
  search: (query, subscriberOrgId) => dispatch(search(query, subscriberOrgId))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchPage)
);
