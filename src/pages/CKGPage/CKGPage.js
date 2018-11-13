import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';
import String from 'src/translations';
import { integrationKeyFromFile } from 'src/utils/dataIntegrations';
import {
  FilesFilters,
  PageHeader,
  TimeActivityGraph,
  GraphActivitySelector,
  GraphZoomActions,
  TeamPicker
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
  history: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  teamId: PropTypes.string,
  search: PropTypes.func.isRequired,
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  files: PropTypes.object,
  excludeFilters: PropTypes.object,
  teams: PropTypes.array,
  query: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  showHeader: PropTypes.bool,
  showSelector: PropTypes.bool
};

const defaultProps = {
  files: {},
  excludeFilters: {},
  teams: [],
  teamId: null,
  query: '',
  caseSensitive: false,
  exactMatch: false,
  showHeader: true,
  showSelector: true
};

// Breadcrumb
const pageBreadCrumb = {
  routes: [
    {
      title: String.t('ckgPage.title')
    },
    {
      title: String.t('graphViewsSelector.timeActivity')
    }
  ]
};

// Page Menu
const menuPageHeader = [
  {
    icon: 'fas fa-chart-area',
    title: 'graphViewsSelector.timeActivity',
    url: ''
  },
  {
    icon: 'fas fa-chart-bar',
    title: 'graphViewsSelector.dashboard',
    url: '',
    submenu: [
      {
        title: 'graphViewsSelector.industryLabel',
        url: '',
        className: 'submenuTitle'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.electronics',
        url: '#',
        className: 'disabled'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.cpg',
        url: '#',
        className: 'disabled'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.manufacturing',
        url: '/app/dashboard'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.retail',
        url: '#',
        className: 'disabled'
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.relationshipHeatMap',
        url: '#',
        className: 'disabled'
      }
    ]
  }
];

class CKGPage extends Component {
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
    const { files, excludeFilters } = this.props;
    const { fileTypes, integrations } = files;

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
      files: { items, integrations },
      excludeFilters,
      showHeader,
      showSelector,
      orgId
    } = this.props;
    if (!items) return null;

    const filesFiltered = items.filter(file => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeFilters.fileTypes[label] && !excludeFilters.integrations[key];
    });

    return (
      <div className="CKGPage">
        {showHeader && (
          <PageHeader pageBreadCrumb={pageBreadCrumb} hasMenu menuName="settings" menuPageHeader={menuPageHeader} />
        )}
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

        {integrations.length === 0 && (
          <div className="CKGPage__center-message-container">
            <div className="CKGPage__center-message">
              <Link to={`/app/integrations/${orgId}`}>{String.t('ckgPage.AddDataIntegration')}</Link>
            </div>
          </div>
        )}

        <TimeActivityGraph
          files={filesFiltered.map(buildDataObject)}
          zoomLevel={this.state.zoomLevel}
          viewAll={this.state.viewAll}
        />

        <div className="bottomBar">
          {showSelector && this.renderSelectors()}
          {this.renderFilesFilter()}
          <div className="clear" />
        </div>
      </div>
    );
  }
}

CKGPage.propTypes = propTypes;
CKGPage.defaultProps = defaultProps;

export default CKGPage;
