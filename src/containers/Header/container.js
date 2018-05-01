import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Header from 'components/Header';
import { logoutUser, updateUser } from 'actions';
import { search, clearSearch } from 'redux-hablaai/actions';
import { getCurrentUser } from 'redux-hablaai/selectors';
import { getCurrentSubscriberOrgId } from 'selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    query: state.search.query,
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
    updateUser: data => dispatch(updateUser(data)),
    search: (query, subscriberOrgId) => dispatch(search(query, subscriberOrgId)),
    clearSearch: () => dispatch(clearSearch())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
