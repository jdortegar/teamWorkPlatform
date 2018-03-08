import { connect } from 'react-redux';
import Main from 'layouts/Main';
import { fetchGlobalState } from 'actions';

function mapStateToProps(state) {
  return {
    subscriberOrgs: state.subscriberOrgs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchGlobalState: () => dispatch(fetchGlobalState())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
