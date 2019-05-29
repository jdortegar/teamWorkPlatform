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
  getExcludeFilters,
  getSearchedChatMessages,
  getSearchedAttachedFiles,
  getSearchedAttachedFileTypes,
  getSearchedAttachedExcludeFilters,
  getChatMessagesOwners,
  getAttachedFilesOwners,
  getSearchedChatMessagesExcludeFilters
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
  CKG_VIEWS
} from 'src/actions';

const mapStateToProps = (state, props) => {
  const { teamId, loading } = props;
  const orgId = getCurrentSubscriberOrgId(state);
  const team = getTeam(state, teamId);
  const activeView = getCKGActiveView(state);

  let fileTypes = getFileTypes(state);
  let excludeFilters = getExcludeFilters(state);
  let owners = getOwners(state);
  let integrations = getFileIntegrations(state);
  if (activeView === CKG_VIEWS.FILE_ATTACHMENTS) {
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
    teams: getActiveTeams(state, orgId),
    query: getSearchQuery(state),
    keywords: getSearchKeywords(state),
    caseSensitive: isSearchCaseSensitive(state),
    exactMatch: isSearchExactMatch(state),
    loading: loading !== undefined ? loading : isSearchLoading(state),
    activeView,
    searchedChatMessages: getSearchedChatMessages(state),
    searchedAttachedFiles: getSearchedAttachedFiles(state)
  };
};

const mapDispatchToProps = {
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
