import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Header } from 'src/components';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSearchQuery,
  isSearchCaseSensitive,
  isSearchExactMatch
} from 'src/selectors';
import { logoutUser, updateUser, search, clearSearch, toggleCaseSensitive, toggleExactMatch } from 'src/actions';

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
    query: getSearchQuery(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    currentSubscriberOrgId: getCurrentSubscriberOrgId(state)
  };
}

const mapDispatchToProps = {
  logoutUser,
  updateUser,
  search,
  clearSearch,
  toggleCaseSensitive,
  toggleExactMatch
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
