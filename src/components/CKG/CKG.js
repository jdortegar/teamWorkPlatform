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
import './styles/style.css';

const propTypes = {
  orgId: PropTypes.string.isRequired,
  teamId: PropTypes.string,
  team: PropTypes.object,
  history: PropTypes.object.isRequired,
  search: PropTypes.func.isRequired,
  toggleOwnerFilter: PropTypes.func.isRequired,
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  setStartDateFilter: PropTypes.func.isRequired,
  setEndDateFilter: PropTypes.func.isRequired,
  changeCKGView: PropTypes.func.isRequired,
  teams: PropTypes.array,
  files: PropTypes.array,
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
  showSelector: PropTypes.bool,
  menuOptions: PropTypes.array,
  activeView: PropTypes.string,
  showChat: PropTypes.func,
  showCKG: PropTypes.func,
  chatVisible: PropTypes.bool
};

const defaultProps = {
  teamId: null,
  team: null,
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
  showSelector: true,
  menuOptions: [],
  activeView: CKG_VIEWS.FILE_LIST,
  showChat: null,
  showCKG: null,
  chatVisible: true
};

class CKG extends Component {
  componentDidMount() {
    const { orgId, teamId, history, search, query, caseSensitive, exactMatch } = this.props;

    this.changeViewFromHash(this.props);

    if (!orgId) {
      history.replace('/app');
      return;
    }

    search(query, { teamId, caseSensitive, exactMatch });
  }

  componentWillReceiveProps(nextProps) {
    const { teamId, search, query, caseSensitive, exactMatch } = nextProps;

    this.changeViewFromHash(nextProps);

    if (this.props.teamId !== teamId) {
      search(query, { teamId, caseSensitive, exactMatch });
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
    const { search, keywords, searchTeamId, caseSensitive, exactMatch } = this.props;
    const query = without(keywords, keyword).join(' ');
    search(query, { teamId: searchTeamId, caseSensitive, exactMatch });
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
    const { team, activeView } = this.props;
    const currentPage = { title: String.t(`ckg.${activeView}`) };

    if (!team) return { routes: [currentPage] };
    return {
      routes: [
        {
          title: team.name,
          url: `/app/team/${team.teamId}`
        },
        currentPage
      ]
    };
  };

  switchViews = () => {
    const { activeView, changeCKGView } = this.props;
    changeCKGView(activeView === CKG_VIEWS.TIME_ACTIVITY ? CKG_VIEWS.FILE_LIST : CKG_VIEWS.TIME_ACTIVITY);
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
      <div>
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

  renderSideArrows = () =>
    ['left', 'right'].map(direction => (
      <div key={direction} className={`CKGPage__arrows-container arrow-${direction}`}>
        <div className="CKGPage__arrows">
          <a onClick={this.switchViews}>
            <i className={`fas fa-arrow-${direction} CKGPage__arrow`} />
          </a>
        </div>
      </div>
    ));

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
    const { loading, files, query, integrations, excludeFilters, showSelector, menuOptions, activeView } = this.props;
    const { startDate, endDate } = excludeFilters;

    const filesFiltered = files.filter(file => {
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

    return (
      <div className="CKG">
        <PageHeader
          pageBreadCrumb={this.buildPageBreadCrumb()}
          hasMenu
          menuName={String.t('settings')}
          menuPageHeader={menuOptions}
          badgeOptions={{
            enabled: true,
            count: filesFiltered.length
          }}
        >
          {this.renderTags()}
          {this.renderDatePicker()}
        </PageHeader>

        {this.renderSideArrows()}

        {!loading && isEmpty(integrations) && isEmpty(query) && this.renderEmptyMessage()}

        {loading && (
          <div className="CKGPage__center-message-container">
            <div className="CKGPage__center-message">
              <Spinner />
            </div>
          </div>
        )}

        {activeView === CKG_VIEWS.TIME_ACTIVITY && <TimeActivityView files={filesFiltered} loading={loading} />}
        {activeView === CKG_VIEWS.FILE_LIST && <FileListView files={filesFiltered} />}

        <div className="bottomBar">
          {showSelector && this.renderSelectors()}
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
