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
  currentSubscriberOrgId: PropTypes.string.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  fetchTimeActivitiesBySubscriberOrgId: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  toggleIntegrationFilter: PropTypes.func.isRequired,
  toggleFileTypeFilter: PropTypes.func.isRequired,
  files: PropTypes.object,
  excludeFilters: PropTypes.object,
  teams: PropTypes.array,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired,
  query: PropTypes.string,
  caseSensitive: PropTypes.bool,
  exactMatch: PropTypes.bool,
  showHeader: PropTypes.bool
};

const defaultProps = {
  files: {},
  excludeFilters: {},
  teams: [],
  query: '',
  caseSensitive: false,
  exactMatch: false,
  showHeader: true
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
  // {
  //   icon: 'fas fa-bullseye',
  //   title: 'graphViewsSelector.teamMemberContribution',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-clone',
  //   title: 'graphViewsSelector.fileLineage',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-sitemap',
  //   title: 'graphViewsSelector.relationshipHeatMap',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-bars',
  //   title: 'graphViewsSelector.smartListView',
  //   url: ''
  // },
  // {
  //   icon: 'fas fa-stop',
  //   title: 'graphViewsSelector.customGraph',
  //   url: ''
  // },
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
    viewAll: true,
    selectedTeamId: ''
  };

  componentDidMount() {
    const {
      search,
      setCurrentSubscriberOrgId,
      currentSubscriberOrgId,
      history,
      match,
      query,
      caseSensitive,
      exactMatch
    } = this.props;

    if (
      !match ||
      !match.params ||
      !match.params.subscriberOrgId ||
      match.params.subscriberOrgId !== currentSubscriberOrgId
    ) {
      history.replace('/app');
      return;
    }

    const { subscriberOrgId } = match.params;
    search(query, subscriberOrgId, caseSensitive, exactMatch);

    if (currentSubscriberOrgId !== subscriberOrgId) {
      setCurrentSubscriberOrgId(subscriberOrgId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentSubscriberOrgId !== nextProps.currentSubscriberOrgId) {
      this.props.fetchTimeActivitiesBySubscriberOrgId(nextProps.currentSubscriberOrgId);
    }

    const { teams, history } = nextProps;
    if (teams.length === 0 || this.state.selectedTeamId) return;

    const { teamId } = history.location.state || {};
    const selectedTeamId = teamId || teams[0].teamId;

    this.setState({ selectedTeamId });
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

  handleSelectTeam = event => {
    this.setState({ selectedTeamId: event.target.value });
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
    const { selectedTeamId } = this.state;

    return (
      <div className="bottomBar-selectors">
        <div className="bottomBar-selectors-content padding-class-a">
          <TeamPicker teams={teams} selected={selectedTeamId} onSelect={this.handleSelectTeam} />
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
      files: { items },
      excludeFilters
    } = this.props;
    if (!items) return null;

    const filesFiltered = items.filter(file => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeFilters.fileTypes[label] && !excludeFilters.integrations[key];
    });

    return (
      <div className="CKGPage">
        {this.props.showHeader && (
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

        {this.props.files.integrations.length === 0 && (
          <div className="CKGPage__center-message-container">
            <div className="CKGPage__center-message">
              <Link to={`/app/integrations/${this.props.currentSubscriberOrgId}`}>
                {String.t('ckgPage.AddDataIntegration')}
              </Link>
            </div>
          </div>
        )}

        <TimeActivityGraph
          files={filesFiltered.map(buildDataObject)}
          zoomLevel={this.state.zoomLevel}
          viewAll={this.state.viewAll}
        />

        <div className="bottomBar">
          {this.renderSelectors()}
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
