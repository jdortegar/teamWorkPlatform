import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import SearchPage from 'pages/SearchPage';
import { search } from 'redux-hablaai/actions';
import { extractQueryParams } from 'routes';

const mapStateToProps = (state, props) => ({
  query: state.search.query,
  results: state.search.results,
  loading: state.search.loading,
  queryParams: extractQueryParams(props)
});

const mapDispatchToProps = dispatch => ({
  search: query => dispatch(search(query))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
