import { connect } from 'react-redux';
import Main from 'layouts/Main';
import { fetchGlobalState } from 'actions';

const mapStateToProps = state => ({
  subscriberOrgs: state.subscriberOrgs
});

const mapDispatchToProps = dispatch => ({
  fetchGlobalState: () => dispatch(fetchGlobalState())
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
