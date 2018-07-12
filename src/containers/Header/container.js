import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Header from 'components/Header';
import { logoutUser, updateUser, clearSearch } from 'actions';
import { getCurrentUser } from 'redux-hablaai/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    query: state.search.query
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
    updateUser: data => dispatch(updateUser(data)),
    clearSearch: () => dispatch(clearSearch())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
