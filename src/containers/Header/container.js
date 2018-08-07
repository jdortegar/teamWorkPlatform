import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Header from 'components/Header';
import { logoutUser, updateUser, search, toggleCaseSensitive } from 'actions';
import { getCurrentUser, getCurrentSubscriberOrgId } from 'redux-hablaai/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    query: state.search.query,
    caseSensitive: state.search.caseSensitive,
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
    updateUser: data => dispatch(updateUser(data)),
    toggleCaseSensitive: value => dispatch(toggleCaseSensitive(value)),
    search: (query, subscriberOrgId, caseSensitive) => dispatch(search(query, subscriberOrgId, caseSensitive))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
