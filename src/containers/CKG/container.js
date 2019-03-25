import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CKG } from 'src/components';
import {
  getCurrentSubscriberOrgId,
  getTeam,
  getTeamsById,
  getActiveTeams,
  getSearchQuery,
  getSearchKeywords,
  getSearchTeamId,
  getCKGActiveView,
  isSearchCaseSensitive,
  isSearchExactMatch,
  isSearchLoading,
  getFiles,
  getOwners,
  getFileIntegrations,
  getFileTypes,
  getExcludeFilters
} from 'src/selectors';
import {
  toggleOwnerFilter,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  setStartDateFilter,
  setEndDateFilter,
  changeCKGView,
  search
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, loading } = props;
  const orgId = getCurrentSubscriberOrgId(state);
  const team = getTeam(state, teamId);

  return {
    orgId,
    team,
    teamById: getTeamsById(state),
    files: getFiles(state),
    owners: getOwners(state),
    integrations: getFileIntegrations(state),
    fileTypes: getFileTypes(state),
    excludeFilters: getExcludeFilters(state),
    searchTeamId: getSearchTeamId(state),
    teams: getActiveTeams(state, orgId),
    query: getSearchQuery(state),
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    loading: loading !== undefined ? loading : isSearchLoading(state),
    activeView: getCKGActiveView(state)
  };
};

const mapDispatchToProps = {
  search,
  toggleOwnerFilter,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  setStartDateFilter,
  setEndDateFilter,
  changeCKGView
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CKG)
);
