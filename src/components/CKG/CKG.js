import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import moment from 'moment';
import * as d3 from 'd3';
import _ from 'lodash';

import String from 'src/translations';
import { integrationKeyFromFile } from 'src/utils/dataIntegrations';
import { PageHeader, FilesFilters, TeamPicker, Spinner } from 'src/components';
import { CKG_VIEWS } from 'src/actions';
import TimeActivityView from './TimeActivityView';
import FileListView from './FileListView';
import './styles/style.css';

const color = d3.scaleOrdinal(d3.schemeCategory10);
const buildTime = dateTime =>
  moment()
    .startOf('day')
    .set({
      hour: dateTime.hour(),
      minute: dateTime.minutes(),
      second: dateTime.seconds()
    });

const buildDataObject = file => {
  const dateTime = moment(file.lastModified);
  return {
    ...file,
    date: dateTime,
    time: buildTime(dateTime),
    color: color(file.fileExtension)
  };
};

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
  owners: PropTypes.array,
  excludeFilters: PropTypes.object,
  query: PropTypes.string,
  keywords: PropTypes.array,
  searchTeamId: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  loading: PropTypes.bool,
  showSelector: PropTypes.bool,
  menuOptions: PropTypes.array,
  activeView: PropTypes.string
};

const defaultProps = {
  teamId: null,
  team: null,
  teams: [],
  files: [],
  integrations: [],
  fileTypes: [],
  owners: [],
  excludeFilters: {},
  query: '',
  keywords: [],
  searchTeamId: null,
  caseSensitive: false,
  exactMatch: false,
  loading: false,
  showSelector: true,
  menuOptions: [],
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

  changeView = () => {
    const { activeView, changeCKGView } = this.props;
    changeCKGView(activeView === CKG_VIEWS.TIME_ACTIVITY ? CKG_VIEWS.FILE_LIST : CKG_VIEWS.TIME_ACTIVITY);
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
    const {
      team,
      loading,
      caseSensitive,
      files,
      integrations,
      owners,
      excludeFilters,
      showSelector,
      menuOptions,
      orgId,
      keywords,
      activeView
    } = this.props;

    const filesFiltered = files.filter(file => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeFilters.fileTypes[label] && !excludeFilters.integrations[key];
    });

    const breadcrumb = [{ title: String.t(`ckg.${activeView}`) }];
    if (team) {
      breadcrumb.unshift({
        title: team.name,
        url: `/app/team/${team.teamId}`
      });
    }

    return (
      <div className="CKG">
        <PageHeader
          pageBreadCrumb={{ routes: breadcrumb }}
          hasMenu
          menuName="settings"
          menuPageHeader={menuOptions}
          badgeOptions={{
            enabled: true,
            count: filesFiltered.length
          }}
        >
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
        </PageHeader>

        <div className="CKGPage__arrows-container arrow-left">
          <div className="CKGPage__arrows">
            <a onClick={this.changeView}>
              <i className="fas fa-arrow-left CKGPage__arrow" />
            </a>
          </div>
        </div>

        <div className="CKGPage__arrows-container arrow-right">
          <div className="CKGPage__arrows">
            <a onClick={this.changeView}>
              <i className="fas fa-arrow-right CKGPage__arrow" />
            </a>
          </div>
        </div>

        {!loading &&
          integrations.length === 0 && (
            <div className="CKGPage__center-message-container">
              <div className="CKGPage__center-message">
                <Link to={`/app/integrations/${orgId}`}>{String.t('ckgPage.AddDataIntegration')}</Link>
              </div>
            </div>
          )}

        {loading && (
          <div className="CKGPage__center-message-container">
            <div className="CKGPage__center-message">
              <Spinner />
            </div>
          </div>
        )}

        {activeView === CKG_VIEWS.TIME_ACTIVITY && (
          <TimeActivityView files={loading ? [] : filesFiltered.map(buildDataObject)} />
        )}
        {activeView === CKG_VIEWS.FILE_LIST && (
          <FileListView
            files={filesFiltered}
            owners={owners}
            keywords={keywords}
            caseSensitive={caseSensitive}
            loading={loading}
          />
        )}

        <div className="bottomBar">
          {showSelector && this.renderSelectors()}
          {!loading && this.renderFilesFilter()}
          <div className="clear" />
        </div>
      </div>
    );
  }
}

CKG.propTypes = propTypes;
CKG.defaultProps = defaultProps;

export default CKG;
