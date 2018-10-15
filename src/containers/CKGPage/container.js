import { connect } from 'react-redux';
import { CKGPage } from 'src/pages';
import {
  getCurrentSubscriberOrgId,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getSearchQuery,
  isSearchCaseSensitive,
  isSearchExactMatch
} from 'src/selectors';
import {
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  search
} from 'src/actions';

const mapStateToProps = state => ({
  teamById: state.teams.teamById,
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  files: state.files,
  excludeFilters: state.files.excludeFilters,
  teams: getTeamsOfSubscriberOrgIdSortedAlphabetically(state, getCurrentSubscriberOrgId(state)),
  query: getSearchQuery(state),
  caseSensitive: isSearchCaseSensitive(state),
  exactMatch: isSearchExactMatch(state)
});

const mapDispatchToProps = {
  search,
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  toggleIntegrationFilter,
  toggleFileTypeFilter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CKGPage);
