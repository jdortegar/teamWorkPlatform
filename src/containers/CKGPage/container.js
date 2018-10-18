import { connect } from 'react-redux';
import { CKGPage } from 'src/pages';
import {
  getCurrentSubscriberOrgId,
  getTeamsById,
  getOrgTeams,
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
  teamById: getTeamsById(state),
  subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  files: state.files,
  excludeFilters: state.files.excludeFilters,
  teams: getOrgTeams(state, getCurrentSubscriberOrgId(state)),
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
