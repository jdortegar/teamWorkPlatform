import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CKG } from 'src/components';
import {
  getCurrentSubscriberOrgId,
  getTeam,
  getTeamsById,
  getUserById,
  getActiveTeams,
  getSearchQuery,
  getSearchKeywords,
  isSearchCaseSensitive,
  isSearchExactMatch,
  isSearchLoading
} from 'src/selectors';
import {
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  search
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId } = props;
  const orgId = getCurrentSubscriberOrgId(state);
  const team = getTeam(state, teamId);

  return {
    orgId,
    team,
    teamById: getTeamsById(state),
    files: state.files.items,
    integrations: state.files.integrations,
    fileTypes: state.files.fileTypes,
    excludeFilters: state.files.excludeFilters,
    owners: state.files.owners.map(({ key, count }) => ({ ...getUserById(state, key), key, count })),
    teams: getActiveTeams(state, orgId),
    query: getSearchQuery(state),
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    loading: isSearchLoading(state)
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
  )(CKG)
);
