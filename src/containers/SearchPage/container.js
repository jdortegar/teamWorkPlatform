import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SearchPage from 'pages/SearchPage';
import { search } from 'redux-hablaai/actions';
import { getCurrentSubscriberOrgId, getUserById } from 'selectors';
import { extractQueryParams } from 'routes';

const mapStateToProps = (state, props) => {
  const results = state.search.results.map(result => ({
    ...result,
    owner: getUserById(state, result.fileOwnerId)
  }));
  return {
    results,
    query: state.search.query,
    fileTypes: state.search.fileTypes,
    integrations: state.search.integrations,
    loading: state.search.loading,
    queryParams: extractQueryParams(props),
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
  };
};

const mapDispatchToProps = dispatch => ({
  search: (query, subscriberOrgId) => dispatch(search(query, subscriberOrgId))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
