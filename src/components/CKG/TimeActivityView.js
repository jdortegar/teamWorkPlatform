import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';

import String from 'src/translations';
import { TimeActivityGraph, GraphZoomActions } from 'src/components';

const color = d3.scaleOrdinal(d3.schemeCategory10);
const buildDataObject = file => ({
  ...file,
  lastModified: moment(file.lastModified),
  fileCreatedAt: moment(file.fileCreatedAt),
  color: color(file.fileExtension)
});

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
    const { viewAll } = this.state;
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
        <div className="TimeActivityView__axis-label y-axis">
          <span>{String.t('timeActivityGraph.yAxisLabel')}</span>
        </div>
        <div className="TimeActivityView__axis-label x-axis">
          <span>{String.t('timeActivityGraph.xAxisLabel')}</span>
        </div>
        <TimeActivityGraph files={files.map(buildDataObject)} loading={loading} viewAll={viewAll} />
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
