import { connect } from 'react-redux';
import Main from 'layouts/Main';
import { fetchGlobalState } from 'actions';

function mapDispatchToProps(dispatch) {
  return {
    fetchGlobalState: () => dispatch(fetchGlobalState())
  };
}

export default connect(null, mapDispatchToProps)(Main);
