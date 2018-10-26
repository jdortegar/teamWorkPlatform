import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Header } from 'src/components';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSearchQuery,
  isSearchCaseSensitive,
  isSearchExactMatch,
  isAdminMode
} from 'src/selectors';
import {
  logoutUser,
  updateUser,
  search,
  clearSearch,
  toggleCaseSensitive,
  toggleExactMatch,
  setAdminMode
} from 'src/actions';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    query: getSearchQuery(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
    isAdminMode: isAdminMode(state)
  };
}

const mapDispatchToProps = {
  logoutUser,
  updateUser,
  search,
  clearSearch,
  toggleCaseSensitive,
  toggleExactMatch,
  setAdminMode
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
