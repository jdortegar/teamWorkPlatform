import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import _ from 'lodash';

import String from 'src/translations';
import { integrationKeyFromFile } from 'src/utils/dataIntegrations';
import { FileListView } from 'src/containers';
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
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  changeCKGView: PropTypes.func.isRequired,
  teams: PropTypes.array,
  files: PropTypes.array,
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
  showChat: PropTypes.func,
  activeView: PropTypes.string
};

const defaultProps = {
  teamId: null,
  team: null,
  teams: [],
  files: [],
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
  showChat: null,
  activeView: CKG_VIEWS.TIME_ACTIVITY
};

class CKG extends Component {
  componentDidMount() {
    const { orgId, teamId, history, search, query, caseSensitive, exactMatch } = this.props;

    if (!orgId) {
      history.replace('/app');
      return;
    }

    search(query, { teamId, caseSensitive, exactMatch });
  }

  componentWillReceiveProps(nextProps) {
    const { teamId, search, query, caseSensitive, exactMatch } = nextProps;

    if (this.props.teamId !== teamId) {
      search(query, { teamId, caseSensitive, exactMatch });
    }
  }

  handleSelectTeam = value => {
    const teamId = value !== 'org' ? value : null;
    const { search, query, caseSensitive, exactMatch } = this.props;
    search(query, { teamId, caseSensitive, exactMatch });
  };

  handleRemoveKeywordClick = keyword => {
    const { search, keywords, searchTeamId, caseSensitive, exactMatch } = this.props;
    const query = _.without(keywords, keyword).join(' ');
    search(query, { teamId: searchTeamId, caseSensitive, exactMatch });
  };

  handleIntegrationFilterClick = key => {
    this.props.toggleIntegrationFilter(key);
  };

  handleFileTypeFilterClick = key => {
    this.props.toggleFileTypeFilter(key);
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

  changeView = () => {
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

  renderSideArrows = () =>
    ['left', 'right'].map(direction => (
      <div key={direction} className={`CKGPage__arrows-container arrow-${direction}`}>
        <div className="CKGPage__arrows">
          <a onClick={this.changeView}>
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
    const { excludeFilters, fileTypes, integrations } = this.props;

    return (
      <FilesFilters
        className="CKGPage__FilesFilters"
        fileTypes={fileTypes}
        integrations={integrations}
        excludeIntegrationsFilter={excludeFilters.integrations}
        excludeTypesFilter={excludeFilters.fileTypes}
        onIntegrationFilterClick={this.handleIntegrationFilterClick}
        onFileTypeFilterClick={this.handleFileTypeFilterClick}
      />
    );
  }

  render() {
    const { loading, files, integrations, excludeFilters, showSelector, menuOptions, activeView } = this.props;

    const filesFiltered = files.filter(file => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeFilters.fileTypes[label] && !excludeFilters.integrations[key];
    });

    return (
      <div className="CKG">
        <PageHeader
          pageBreadCrumb={this.buildPageBreadCrumb()}
          hasMenu
          menuName="settings"
          menuPageHeader={menuOptions}
          badgeOptions={{
            enabled: true,
            count: filesFiltered.length
          }}
        >
          {this.renderTags()}
        </PageHeader>

        {this.renderSideArrows()}

        {!loading && integrations.length === 0 && this.renderEmptyMessage()}

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
          <div className="clear" />
          <div className="Chat_expandAction" onClick={() => this.props.showChat(false)}>
            <i className="fas fa-angle-double-up" />
          </div>
        </div>
      </div>
    );
  }
}

CKG.propTypes = propTypes;
CKG.defaultProps = defaultProps;

export default CKG;
