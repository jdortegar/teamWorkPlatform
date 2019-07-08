import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { CKG } from 'src/components';
import {
  getCurrentSubscriberOrgId,
  getTeam,
  getTeamsById,
  getCurrentUserTeams,
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
  getExcludeFilters,
  getSearchedChatMessages,
  getSearchedAttachedFiles,
  getSearchedAttachedFileTypes,
  getSearchedAttachedExcludeFilters,
  getChatMessagesOwners,
  getAttachedFilesOwners,
  getSearchedChatMessagesExcludeFilters,
  getSearchedFiles,
  isSearchAll,
  getAllFilesOwners,
  getSearchedExcludeFilters,
  getSearchedFileTypes,
  getSearchedFileIntegrations
} from 'src/selectors';
import {
  toggleOwnerFilter,
  toggleIntegrationFilter,
  toggleFileTypeFilter,
  setStartDateFilter,
  setEndDateFilter,
  changeCKGView,
  search,
  globalSearch,
  CKG_VIEWS,
  clearSearch
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, loading } = props;
  const query = getSearchQuery(state);
  const orgId = getCurrentSubscriberOrgId(state);
  const team = getTeam(state, teamId);
  const activeView = getCKGActiveView(state);

  const searchAll = isSearchAll(state);

  let fileTypes = getFileTypes(state);
  let excludeFilters = getExcludeFilters(state);
  let owners = getOwners(state);
  let integrations = getFileIntegrations(state);
  if (activeView === CKG_VIEWS.FILE_LIST && searchAll && query.length > 0) {
    owners = getAllFilesOwners(state);
    excludeFilters = getSearchedExcludeFilters(state);
    integrations = getSearchedFileIntegrations(state);
    fileTypes = getSearchedFileTypes(state);
  } else if (activeView === CKG_VIEWS.FILE_ATTACHMENTS) {
    owners = getAttachedFilesOwners(state);
    excludeFilters = getSearchedAttachedExcludeFilters(state);
    integrations = [];
    fileTypes = getSearchedAttachedFileTypes(state);
  } else if (activeView === CKG_VIEWS.MESSAGES) {
    owners = getChatMessagesOwners(state);
    excludeFilters = getSearchedChatMessagesExcludeFilters(state);
    integrations = [];
    fileTypes = [];
  }

  return {
    orgId,
    team,
    teamById: getTeamsById(state),
    files: getFiles(state),
    owners,
    integrations,
    fileTypes,
    excludeFilters,
    searchTeamId: getSearchTeamId(state),
    teams: getCurrentUserTeams(state, orgId),
    query,
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    loading: loading !== undefined ? loading : isSearchLoading(state),
    activeView,
    searchedChatMessages: getSearchedChatMessages(state),
    searchedAttachedFiles: getSearchedAttachedFiles(state),
    searchedFiles: getSearchedFiles(state),
    searchAll
  };
};

const mapDispatchToProps = {
  clearSearch,
  search,
  globalSearch,
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
