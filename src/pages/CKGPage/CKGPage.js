import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';

import { integrationKeyFromFile } from 'utils/dataIntegrations';
import {
  FilesFilters,
  NewSubpageHeader,
  TimeActivityGraph,
  GraphViewSelector,
  GraphActivitySelector,
  GraphZoomActions,
  TeamPicker,
  TeamRoomPicker
} from 'components';
import { primaryAtTop } from 'redux-hablaai/selectors/helpers';
import String from 'translations';
import './styles/style.css';

const color = d3.scaleOrdinal(d3.schemeCategory10);
const buildTime = dateTime => moment().startOf('day').set({
  hour: dateTime.hour(),
  minute: dateTime.minutes(),
  second: dateTime.seconds()
});

const buildDataObject = (file) => {
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
  timeActivities: PropTypes.object,
  teams: PropTypes.array,
  teamRooms: PropTypes.array,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  }).isRequired
};

const defaultProps = {
  timeActivities: null,
  teams: [],
  teamRooms: []
};


class CKGPage extends Component {
  state = {
    zoomLevel: 0,
    viewAll: false,
    excludeTypesFilter: {},
    excludeIntegrationsFilter: {},
    selectedTeamId: '',
    selectedTeamRoomId: ''
  };

  componentDidMount() {
    const { fetchTimeActivitiesBySubscriberOrgId, setCurrentSubscriberOrgId, currentSubscriberOrgId, history, match } = this.props;

    if (!match || !match.params || !match.params.subscriberOrgId || (match.params.subscriberOrgId !== currentSubscriberOrgId)) {
      history.replace('/app');
      return;
    }

    const { subscriberOrgId } = match.params;
    fetchTimeActivitiesBySubscriberOrgId(subscriberOrgId);
    if (currentSubscriberOrgId !== subscriberOrgId) {
      setCurrentSubscriberOrgId(subscriberOrgId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { teams, teamRooms, history } = nextProps;
    if (teams.length === 0 || this.state.selectedTeamId || this.state.selectedTeamRoomId) return;

    const { teamId, teamRoomId } = history.location.state || {};
    const selectedTeamId = teamId || teams[0].teamId;
    let selectedTeamRoomId = teamRoomId;

    if (!selectedTeamRoomId) {
      const teamRoom = teamRooms.find(room => room.primary && room.teamId === selectedTeamId);
      selectedTeamRoomId = teamRoom ? teamRoom.teamRoomId : '';
    }

    this.setState({ selectedTeamId, selectedTeamRoomId });
  }

  handleZoomIn = () => {
    this.setState(prevState => ({
      zoomLevel: prevState.zoomLevel + 1,
      viewAll: false
    }));
  }

  handleZoomOut = () => {
    this.setState(prevState => ({
      zoomLevel: prevState.zoomLevel - 1,
      viewAll: false
    }));
  }

  handleViewAll = () => {
    this.setState({ viewAll: true });
  }

  handleSelectTeam = (event) => {
    this.setState({ selectedTeamId: event.target.value });
  }

  handleSelectTeamRoom = (event) => {
    this.setState({ selectedTeamRoomId: event.target.value });
  }

  handleIntegrationFilterClick = (key) => {
    const { excludeIntegrationsFilter } = this.state;
    this.setState({ excludeIntegrationsFilter: { ...excludeIntegrationsFilter, [key]: excludeIntegrationsFilter[key] ? null : true } });
  }

  handleFileTypeFilterClick = (key) => {
    const { excludeTypesFilter } = this.state;
    this.setState({ excludeTypesFilter: { ...excludeTypesFilter, [key]: excludeTypesFilter[key] ? null : true } });
  }

  handleFileTypeFilterDoubleClick = () => {
    const { fileTypes } = this.props.timeActivities;
    const allSelected = Object.keys(this.state.excludeTypesFilter).length === fileTypes.length;
    const allFilters = fileTypes.reduce((obj, file) => ({ ...obj, [file.key]: true }), {});
    this.setState({ excludeTypesFilter: allSelected ? {} : allFilters });
  }

  renderSelectors = () => {
    const { teams, teamRooms } = this.props;
    const { selectedTeamId, selectedTeamRoomId } = this.state;
    const filteredTeamRooms = primaryAtTop(teamRooms.filter(teamRoom => teamRoom.teamId === selectedTeamId));

    return (
      <div className="bottomBar-selectors">
        <div className="bottomBar-selectors-content padding-class-a">
          <TeamPicker
            teams={teams}
            selected={selectedTeamId}
            onSelect={this.handleSelectTeam}
          />
          <TeamRoomPicker
            teamRooms={filteredTeamRooms}
            selected={selectedTeamRoomId}
            onSelect={this.handleSelectTeamRoom}
          />
          <div className="clear" />
        </div>
      </div>
    );
  }

  renderFilesFilter() {
    const { fileTypes, integrations } = this.props.timeActivities;
    return (
      <FilesFilters
        className={'CKGPage__FilesFilters'}
        fileTypes={fileTypes}
        integrations={integrations}
        excludeIntegrationsFilter={this.state.excludeIntegrationsFilter}
        excludeTypesFilter={this.state.excludeTypesFilter}
        onIntegrationFilterClick={this.handleIntegrationFilterClick}
        onFileTypeFilterClick={this.handleFileTypeFilterClick}
        onFileTypeFilterDoubleClick={this.handleFileTypeFilterDoubleClick}
      />
    );
  }

  render() {
    const { timeActivities, currentSubscriberOrgId } = this.props;
    if (!timeActivities || !timeActivities.files) return null;

    const { files } = timeActivities;
    const { excludeTypesFilter, excludeIntegrationsFilter } = this.state;
    const filesFiltered = files.filter((file) => {
      const label = file.fileExtension || String.t('ckgPage.filterTypeOther');
      const key = integrationKeyFromFile(file);
      return !excludeTypesFilter[label] && !excludeIntegrationsFilter[key];
    });

    return (
      <div className="CKGPage">
        <NewSubpageHeader>
          <div className="habla-main-content-header-title">
            <GraphViewSelector currentSubscriberOrgId={currentSubscriberOrgId} />
            <div className="habla-title flexClass breadcrumbLevels">
              <div className="habla-title-light">{String.t('ckgPage.title')}</div>
              <i className="fas fa-angle-right" />
              <div className="habla-title-normal">{String.t('ckgPage.timeActivityGraph')}</div>
            </div>
          </div>
        </NewSubpageHeader>

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
