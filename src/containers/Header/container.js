import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Header from 'components/Header';
import { logoutUser, updateUser, search, clearSearch, toggleCaseSensitive, toggleAndOperator } from 'actions';
import { getCurrentUser, getCurrentSubscriberOrgId } from 'redux-hablaai/selectors';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    query: state.search.query,
    caseSensitive: state.search.caseSensitive,
    andOperator: state.search.andOperator,
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
  };
}

const mapDispatchToProps = {
  logoutUser,
  updateUser,
  search,
  clearSearch,
  toggleCaseSensitive,
  toggleAndOperator
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
