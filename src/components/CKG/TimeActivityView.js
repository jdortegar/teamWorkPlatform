import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';

import { TimeActivityGraph, GraphZoomActions } from 'src/components';

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

class TimeActivityView extends Component {
  state = {
    zoomLevel: 0,
    viewAll: true
  };

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

  render() {
    const { files, loading } = this.props;
    const { zoomLevel, viewAll } = this.state;
    return (
      <div className="TimeActivityView">
        <div className="ckg-tools-container">
          <div className="habla-ckg-tools">
            <GraphZoomActions
              onZoomIn={this.handleZoomIn}
              onZoomOut={this.handleZoomOut}
              onViewAll={this.handleViewAll}
            />
          </div>
        </div>
        <TimeActivityGraph files={loading ? [] : files.map(buildDataObject)} zoomLevel={zoomLevel} viewAll={viewAll} />
      </div>
    );
  }
}

TimeActivityView.propTypes = {
  files: PropTypes.array,
  loading: PropTypes.bool
};

TimeActivityView.defaultProps = {
  files: [],
  loading: false
};

export default TimeActivityView;
