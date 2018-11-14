import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as d3 from 'd3';

import String from 'src/translations';
import { integrationKeyFromFile } from 'src/utils/dataIntegrations';
import {
  FilesFilters,
  TimeActivityGraph,
  GraphActivitySelector,
  GraphZoomActions,
  TeamPicker,
  Spinner
} from 'src/components';
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
  history: PropTypes.object.isRequired,
  search: PropTypes.func.isRequired,
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  teams: PropTypes.array,
  files: PropTypes.array,
  integrations: PropTypes.array,
  fileTypes: PropTypes.array,
  excludeFilters: PropTypes.object,
  query: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  loading: PropTypes.bool,
  showSelector: PropTypes.bool
};

const defaultProps = {
  teamId: null,
  teams: [],
  files: [],
  integrations: [],
  fileTypes: [],
  excludeFilters: {},
  query: '',
  caseSensitive: false,
  exactMatch: false,
  loading: false,
  showSelector: true
};

class CKG extends Component {
  state = {
    zoomLevel: 0,
    viewAll: true
  };

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

  handleZoomIn = () => {
    this.setState(prevState => ({
      zoomLevel: prevState.zoomLevel + 1,
      viewAll: false
    }));
  };

  handleZoomOut = () => {
    this.setState(prevState => ({
      zoomLevel: prevState.zoomLevel - 1,
      viewAll: false
    }));
  };

  handleViewAll = () => {
    this.setState({ viewAll: true });
  };

  handleSelectTeam = value => {
    const teamId = value !== 'org' ? value : null;
    const { search, query, caseSensitive, exactMatch } = this.props;
    search(query, { teamId, caseSensitive, exactMatch });
  };

  handleIntegrationFilterClick = key => {
    this.props.toggleIntegrationFilter(key);
  };

  handleFileTypeFilterClick = key => {
    this.props.toggleFileTypeFilter(key);
  };

  handleArrowClick = () => {
    this.props.history.push('/app/search');
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
    const { loading, files, integrations, excludeFilters, showSelector, orgId } = this.props;
    const { zoomLevel, viewAll } = this.state;

    const filesFiltered = files.filter(file => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeFilters.fileTypes[label] && !excludeFilters.integrations[key];
    });

    return (
      <div className="CKG">
        <div className="ckg-tools-container">
          <div className="habla-ckg-tools">
            <GraphActivitySelector />
            <GraphZoomActions
              onZoomIn={this.handleZoomIn}
              onZoomOut={this.handleZoomOut}
              onViewAll={this.handleViewAll}
            />
          </div>
        </div>

        <div className="CKGPage__arrows-container arrow-left">
          <div className="CKGPage__arrows">
            <a onClick={this.handleArrowClick}>
              <i className="fas fa-arrow-left CKGPage__arrow" />
            </a>
          </div>
        </div>

        <div className="CKGPage__arrows-container arrow-right">
          <div className="CKGPage__arrows">
            <a onClick={this.handleArrowClick}>
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

        <TimeActivityGraph
          files={loading ? [] : filesFiltered.map(buildDataObject)}
          zoomLevel={zoomLevel}
          viewAll={viewAll}
        />

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
