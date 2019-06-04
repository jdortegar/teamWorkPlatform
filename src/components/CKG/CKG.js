import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tag, DatePicker } from 'antd';
import moment from 'moment';
import { isEmpty, without } from 'lodash';

import String from 'src/translations';
import { integrationKeyFromFile } from 'src/utils/dataIntegrations';
import { FileListView, TeamCallButton } from 'src/containers';
import { PageHeader, FilesFilters, TeamPicker, Spinner } from 'src/components';
import { CKG_VIEWS } from 'src/actions';
import TimeActivityView from './TimeActivityView';
import ChatMessagesView from './ChatMessagesView';
import ViewSelector from './ViewSelector';
import './styles/style.css';

const propTypes = {
  activeView: PropTypes.string,
  caseSensitive: PropTypes.bool,
  changeCKGView: PropTypes.func.isRequired,
  chatVisible: PropTypes.bool,
  exactMatch: PropTypes.bool,
  excludeFilters: PropTypes.object,
  files: PropTypes.array,
  fileTypes: PropTypes.array,
  globalSearch: PropTypes.func.isRequired,
  ignoreSearch: PropTypes.bool,
  integrations: PropTypes.array,
  keywords: PropTypes.array,
  loading: PropTypes.bool,
  menuOptions: PropTypes.array,
  orgId: PropTypes.string.isRequired,
  owners: PropTypes.array,
  query: PropTypes.string,
  search: PropTypes.func.isRequired,
  searchedAttachedFiles: PropTypes.array,
  searchedChatMessages: PropTypes.array,
  searchTeamId: PropTypes.string,
  setEndDateFilter: PropTypes.func.isRequired,
  setStartDateFilter: PropTypes.func.isRequired,
  showChat: PropTypes.func,
  showCKG: PropTypes.func,
  team: PropTypes.object,
  teamId: PropTypes.string,
  teams: PropTypes.array,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleOwnerFilter: PropTypes.func.isRequired
};

const defaultProps = {
  activeView: CKG_VIEWS.FILE_LIST,
  caseSensitive: false,
  chatVisible: true,
  exactMatch: false,
  excludeFilters: {},
  files: [],
  fileTypes: [],
  ignoreSearch: false,
  integrations: [],
  keywords: [],
  loading: false,
  menuOptions: [],
  owners: [],
  query: '',
  searchedAttachedFiles: [],
  searchedChatMessages: [],
  searchTeamId: null,
  showChat: null,
  showCKG: null,
  team: null,
  teamId: null,
  teams: []
};

class CKG extends Component {
  componentDidMount() {
    const {
      ignoreSearch,
      teamId,
      activeView,
      changeCKGView,
      search,
      globalSearch,
      query,
      caseSensitive,
      exactMatch
    } = this.props;

    this.changeViewFromHash(this.props);

    if (teamId && (activeView === CKG_VIEWS.MESSAGES || activeView === CKG_VIEWS.FILE_ATTACHMENTS)) {
      changeCKGView(CKG_VIEWS.FILE_LIST);
    }

    if (!ignoreSearch) {
      search(query, { teamId, caseSensitive, exactMatch });
      globalSearch(query, { caseSensitive, exactMatch });
    }

    if (teamId) {
      globalSearch();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ignoreSearch, teamId, search, globalSearch, query, caseSensitive, exactMatch } = nextProps;

    this.changeViewFromHash(nextProps);

    if (!ignoreSearch && this.props.teamId !== teamId) {
      search(query, { teamId, caseSensitive, exactMatch });
      globalSearch(query, { caseSensitive, exactMatch });
    }
  }

  changeViewFromHash = props => {
    const { location, history, changeCKGView } = props;
    const { hash, pathname } = location;
    if (!hash) return;

    // if we receive a specific view from location hash, change it and remove from URL
    const view = hash.replace('#', '');
    if (Object.values(CKG_VIEWS).includes(view)) {
      changeCKGView(view);
      history.replace(pathname);
    }
  };

  handleSelectTeam = value => {
    const teamId = value !== 'org' ? value : null;
    const { search, query, caseSensitive, exactMatch } = this.props;
    search(query, { teamId, caseSensitive, exactMatch });
  };

  handleRemoveKeywordClick = keyword => {
    const { search, globalSearch, keywords, searchTeamId, caseSensitive, exactMatch, changeCKGView } = this.props;
    const query = without(keywords, keyword).join(' ');
    search(query, { teamId: searchTeamId, caseSensitive, exactMatch });
    globalSearch(query, { caseSensitive, exactMatch });
    if (query.length === 0) {
      changeCKGView(CKG_VIEWS.FILE_LIST);
    }
  };

  handleIntegrationFilterClick = key => {
    this.props.toggleIntegrationFilter(key);
  };

  handleFileTypeFilterClick = key => {
    this.props.toggleFileTypeFilter(key);
  };

  handleOwnerFilterClick = key => {
    this.props.toggleOwnerFilter(key);
  };

  buildPageBreadCrumb = () => {
    const { team, query, activeView } = this.props;
    const currentPage = { title: String.t(`ckg.${activeView}`) };

    if (team) {
      return { routes: [{ title: team.name, url: `/app/team/${team.teamId}` }, currentPage] };
    }
    if (query.length > 0) {
      return { routes: [{ title: String.t('ckg.searchPageTitle') }, currentPage] };
    }

    return { routes: [currentPage] };
  };

  renderEmptyMessage = () => {
    const { team, orgId } = this.props;
    return (
      <div className="CKGPage__center-message-container">
        <div className="CKGPage__center-message">
          <Link to={team ? `/app/teamIntegrations/${team.teamId}` : `/app/integrations/${orgId}`}>
            {String.t('ckgPage.AddDataIntegration')}
          </Link>
        </div>
      </div>
    );
  };

  renderViewSelector = () => {
    const { changeCKGView, activeView, query, searchedChatMessages, searchedAttachedFiles, files } = this.props;

    return (
      <ViewSelector
        query={query}
        searchedChatMessages={searchedChatMessages.length}
        searchedAttachedFiles={searchedAttachedFiles.length}
        files={files.length}
        activeView={activeView}
        onChange={changeCKGView}
        hideMessages={query.length === 0}
        hideFileAttachments={query.length === 0}
      />
    );
  };

  renderTags = () => {
    const { keywords } = this.props;
    return (
      <span className="CKG__keywords">
        {keywords.map(keyword => (
          <Tag
            closable
            key={keyword}
            className="CKG__tag"
            onClose={() => this.handleRemoveKeywordClick(keyword)}
            visible={keywords.includes(keyword)}
          >
            {keyword}
          </Tag>
        ))}
      </span>
    );
  };

  renderDatePicker = () => {
    const { setStartDateFilter, setEndDateFilter, excludeFilters } = this.props;
    const { startDate, endDate } = excludeFilters;

    return (
      <div className="CKG__date-pickers">
        <DatePicker
          className="CKG__date-picker"
          value={startDate && moment(startDate)}
          onChange={setStartDateFilter}
          placeholder={String.t('ckg.startDate')}
          format="ll"
        />
        <DatePicker
          className="CKG__date-picker"
          value={endDate && moment(endDate)}
          onChange={setEndDateFilter}
          placeholder={String.t('ckg.endDate')}
          format="ll"
        />
      </div>
    );
  };

  renderSelectors = () => {
    const { teams } = this.props;

    return (
      <div className="bottomBar-selectors">
        <div className="bottomBar-selectors-content padding-class-a">
          <TeamPicker teams={teams} onSelect={this.handleSelectTeam} />
          <div className="clear" />
        </div>
      </div>
    );
  };

  renderFilesFilter() {
    const { excludeFilters, fileTypes, integrations, owners, team, orgId } = this.props;

    return (
      <FilesFilters
        className="CKGPage__FilesFilters"
        team={team}
        orgId={orgId}
        owners={owners}
        fileTypes={fileTypes}
        integrations={integrations}
        excludeOwnersFilter={excludeFilters.owners}
        excludeIntegrationsFilter={excludeFilters.integrations}
        excludeTypesFilter={excludeFilters.fileTypes}
        onOwnerFilterClick={this.handleOwnerFilterClick}
        onIntegrationFilterClick={this.handleIntegrationFilterClick}
        onFileTypeFilterClick={this.handleFileTypeFilterClick}
      />
    );
  }

  render() {
    const {
      loading,
      searchedChatMessages,
      searchedAttachedFiles,
      files,
      query,
      integrations,
      excludeFilters,
      menuOptions,
      activeView,
      ignoreSearch,
      changeCKGView
    } = this.props;
    const { startDate, endDate } = excludeFilters;

    // CONFIG PER VIEW

    let itemLength = 0;
    let filesFiltered = [];
    let chatMessagesFiltered = [];
    let attachedFilesFiltered = [];

    if (activeView === CKG_VIEWS.FILE_ATTACHMENTS) {
      // Filter function for attached Files
      if (searchedAttachedFiles.length === 0) {
        changeCKGView(CKG_VIEWS.FILE_LIST);
      }
      attachedFilesFiltered = searchedAttachedFiles.filter(file => {
        const label = file.fileExtension || String.t('ckgPage.filterTypeOther');

        const validDate =
          (startDate ? moment(file.fileCreatedAt).isSameOrAfter(moment(startDate).startOf('day')) : true) &&
          (endDate ? moment(file.fileCreatedAt).isSameOrBefore(moment(endDate).endOf('day')) : true);

        return validDate && !excludeFilters.fileTypes[label] && !excludeFilters.owners[file.fileOwnerId];
      });
      itemLength = attachedFilesFiltered.length;
    } else if (activeView === CKG_VIEWS.MESSAGES) {
      // Filter function for chat messages
      if (searchedChatMessages.length === 0) {
        changeCKGView(CKG_VIEWS.FILE_LIST);
      }
      chatMessagesFiltered = searchedChatMessages.filter(file => {
        const validDate =
          (startDate ? moment(file.created).isSameOrAfter(moment(startDate).startOf('day')) : true) &&
          (endDate ? moment(file.created).isSameOrBefore(moment(endDate).endOf('day')) : true);

        return validDate && !excludeFilters.owners[file.createdBy];
      });
      itemLength = chatMessagesFiltered.length;
    } else if (activeView === CKG_VIEWS.FILE_LIST || activeView === CKG_VIEWS.TIME_ACTIVITY) {
      // Filter function for integration files
      filesFiltered = files.filter(file => {
        const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
        const key = integrationKeyFromFile(file);

        const validDate =
          (startDate ? moment(file.fileCreatedAt).isSameOrAfter(moment(startDate).startOf('day')) : true) &&
          (endDate ? moment(file.fileCreatedAt).isSameOrBefore(moment(endDate).endOf('day')) : true);

        return (
          validDate &&
          !excludeFilters.fileTypes[label] &&
          !excludeFilters.integrations[key] &&
          !excludeFilters.owners[file.fileOwnerId]
        );
      });
      itemLength = filesFiltered.length;
    }

    return (
      <div className="CKG">
        <PageHeader
          pageBreadCrumb={this.buildPageBreadCrumb()}
          hasMenu
          menuName="settings"
          menuPageHeader={menuOptions}
          badgeOptions={{
            enabled: true,
            count: itemLength
          }}
        >
          {this.renderViewSelector()}
          {!ignoreSearch && this.renderTags()}
          {!ignoreSearch && this.renderDatePicker()}
        </PageHeader>

        {!loading && isEmpty(integrations) && isEmpty(query) && this.renderEmptyMessage()}

        {loading && (
          <div className="CKGPage__center-message-container">
            <div className="CKGPage__center-message">
              <Spinner />
            </div>
          </div>
        )}

        {activeView === CKG_VIEWS.MESSAGES && <ChatMessagesView messages={chatMessagesFiltered} />}
        {activeView === CKG_VIEWS.FILE_LIST && (
          <FileListView files={filesFiltered} loading={loading} highlightSearch={!ignoreSearch} />
        )}
        {activeView === CKG_VIEWS.TIME_ACTIVITY && <TimeActivityView files={filesFiltered} loading={loading} />}
        {activeView === CKG_VIEWS.FILE_ATTACHMENTS && (
          <FileListView
            files={attachedFilesFiltered}
            loading={loading}
            highlightSearch={!ignoreSearch}
            attachedFilesMode
          />
        )}

        <div className="bottomBar">
          {!ignoreSearch &&
            (activeView === CKG_VIEWS.TIME_ACTIVITY || activeView === CKG_VIEWS.FILE_LIST) &&
            this.renderSelectors()}
          {!loading && this.renderFilesFilter()}
          <div className="Chat_videoCall_container">
            <TeamCallButton />
          </div>
          <div className="clear" />
          {this.props.showChat && this.props.chatVisible && (
            <div>
              <div className="Chat_expandAction" onClick={() => this.props.showCKG(false)}>
                <i className="fas fa-angle-up" />
              </div>
              <div className="CKG_expandAction" onClick={() => this.props.showChat(false)}>
                <i className="fas fa-angle-down" />
              </div>
            </div>
          )}
          {this.props.showChat && !this.props.chatVisible && (
            <div className="CKG_expandActionSolo" onClick={() => this.props.showChat(true)}>
              <i className="fas fa-angle-up" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

CKG.propTypes = propTypes;
CKG.defaultProps = defaultProps;

export default CKG;
