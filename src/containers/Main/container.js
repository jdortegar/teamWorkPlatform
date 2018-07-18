import { connect } from 'react-redux';
import Main from 'layouts/Main';
import { initMessaging, closeMessaging, fetchGlobalState } from 'actions';

const mapStateToProps = state => ({
  subscriberOrgs: state.subscriberOrgs
});

const mapDispatchToProps = dispatch => ({
  initMessaging: () => dispatch(initMessaging()),
  closeMessaging: () => dispatch(closeMessaging()),
  fetchGlobalState: () => dispatch(fetchGlobalState())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
