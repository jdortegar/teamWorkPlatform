import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CKG } from 'src/components';
import {
  getCurrentSubscriberOrgId,
  getTeam,
  getTeamsById,
  getActiveTeams,
  getCKGActiveView,
  getSearchQuery,
  getSearchKeywords,
  getSearchTeamId,
  isSearchCaseSensitive,
  isSearchExactMatch,
  isSearchLoading,
  getFiles,
  getFileIntegrations,
  getFileTypes,
  getExcludeFilters
} from 'src/selectors';
import {
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  changeCKGView,
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
    files: getFiles(state),
    integrations: getFileIntegrations(state),
    fileTypes: getFileTypes(state),
    excludeFilters: getExcludeFilters(state),
    searchTeamId: getSearchTeamId(state),
    teams: getActiveTeams(state, orgId),
    query: getSearchQuery(state),
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    loading: isSearchLoading(state),
    activeView: getCKGActiveView(state)
  };
};

const mapDispatchToProps = {
  search,
  fetchTimeActivitiesBySubscriberOrgId,
  setCurrentSubscriberOrgId,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  changeCKGView
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CKG)
);
