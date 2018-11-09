import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    orgId,
    teamById: getTeamsById(state),
    subscriberOrgById: state.subscriberOrgs.subscriberOrgById,
    files: state.files,
    excludeFilters: state.files.excludeFilters,
    teams: getOrgTeams(state, orgId),
    query: getSearchQuery(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state)
  };
};

const mapDispatchToProps = {
  search,
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  toggleIntegrationFilter,
  toggleFileTypeFilter
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CKGPage)
);
