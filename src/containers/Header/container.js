import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Header } from 'src/components';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSearchQuery,
  getSearchTeamId,
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

const mapStateToProps = state => ({
  user: getCurrentUser(state),
  query: getSearchQuery(state),
  teamId: getSearchTeamId(state),
  caseSensitive: isSearchCaseSensitive(state),
  exactMatch: isSearchExactMatch(state),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  isAdminMode: isAdminMode(state)
});

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
