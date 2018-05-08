import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SearchPage from 'pages/SearchPage';
import { search } from 'redux-hablaai/actions';
import { getCurrentSubscriberOrgId } from 'selectors';
import { extractQueryParams } from 'routes';

const mapStateToProps = (state, props) => ({
  query: state.search.query,
  results: state.search.results,
  fileTypes: state.search.fileTypes,
  integrations: state.search.integrations,
  loading: state.search.loading,
  queryParams: extractQueryParams(props),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
});

const mapDispatchToProps = dispatch => ({
  search: (query, subscriberOrgId) => dispatch(search(query, subscriberOrgId))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
