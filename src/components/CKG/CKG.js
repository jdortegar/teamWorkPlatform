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
  orgId: PropTypes.string.isRequired,
  teamId: PropTypes.string,
  team: PropTypes.object,
  search: PropTypes.func.isRequired,
  globalSearch: PropTypes.func.isRequired,
  toggleOwnerFilter: PropTypes.func.isRequired,
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  setStartDateFilter: PropTypes.func.isRequired,
  setEndDateFilter: PropTypes.func.isRequired,
  changeCKGView: PropTypes.func.isRequired,
  teams: PropTypes.array,
  files: PropTypes.array,
  searchedChatMessages: PropTypes.array,
  searchedAttachedFiles: PropTypes.array,
  owners: PropTypes.array,
  integrations: PropTypes.array,
  fileTypes: PropTypes.array,
  excludeFilters: PropTypes.object,
  query: PropTypes.string,
  keywords: PropTypes.array,
  searchTeamId: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  loading: PropTypes.bool,
  menuOptions: PropTypes.array,
  activeView: PropTypes.string,
  showChat: PropTypes.func,
  showCKG: PropTypes.func,
  chatVisible: PropTypes.bool,
  ignoreSearch: PropTypes.bool
};

const defaultProps = {
  teamId: null,
  team: null,
  searchedChatMessages: [],
  searchedAttachedFiles: [],
  teams: [],
  files: [],
  owners: [],
  integrations: [],
  fileTypes: [],
  excludeFilters: {},
  query: '',
  keywords: [],
  searchTeamId: null,
  caseSensitive: false,
  exactMatch: false,
  loading: false,
  menuOptions: [],
  activeView: CKG_VIEWS.FILE_LIST,
  showChat: null,
  showCKG: null,
  chatVisible: true,
  ignoreSearch: false
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
    const { changeCKGView, activeView, query } = this.props;
    return (
      <ViewSelector
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
      ignoreSearch
    } = this.props;
    const { startDate, endDate } = excludeFilters;

    // CONFIG PER VIEW

    let itemLength = 0;
    let filesFiltered = [];
    let chatMessagesFiltered = [];
    let attachedFilesFiltered = [];

    if (activeView === CKG_VIEWS.FILE_LIST || activeView === CKG_VIEWS.TIME_ACTIVITY) {
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
    } else if (activeView === CKG_VIEWS.MESSAGES) {
      // Filter function for chat messages
      chatMessagesFiltered = searchedChatMessages.filter(file => {
        const validDate =
          (startDate ? moment(file.created).isSameOrAfter(moment(startDate).startOf('day')) : true) &&
          (endDate ? moment(file.created).isSameOrBefore(moment(endDate).endOf('day')) : true);

        return validDate && !excludeFilters.owners[file.createdBy];
      });
      itemLength = chatMessagesFiltered.length;
    } else if (activeView === CKG_VIEWS.FILE_ATTACHMENTS) {
      // Filter function for attached Files
      attachedFilesFiltered = searchedAttachedFiles.filter(file => {
        const label = file.fileExtension || String.t('ckgPage.filterTypeOther');

        const validDate =
          (startDate ? moment(file.fileCreatedAt).isSameOrAfter(moment(startDate).startOf('day')) : true) &&
          (endDate ? moment(file.fileCreatedAt).isSameOrBefore(moment(endDate).endOf('day')) : true);

        return validDate && !excludeFilters.fileTypes[label] && !excludeFilters.owners[file.fileOwnerId];
      });
      itemLength = attachedFilesFiltered.length;
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
