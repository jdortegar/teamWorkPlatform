import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'antd';

import String from 'src/translations';
import { TimeActivityGraph, GraphZoomActions } from 'src/components';

const buildDataObject = file => ({
  ...file,
  lastModified: moment(file.lastModified),
  fileCreatedAt: moment(file.fileCreatedAt)
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
          <span>
            <Tooltip placement="topLeft" title={String.t('timeActivityGraph.yAxisLabelTooltip')} arrowPointAtCenter>
              {String.t('timeActivityGraph.yAxisLabel')}
            </Tooltip>
          </span>
        </div>
        <div className="TimeActivityView__axis-label x-axis">
          <span>
            <Tooltip placement="topLeft" title={String.t('timeActivityGraph.xAxisLabelTooltip')} arrowPointAtCenter>
              {String.t('timeActivityGraph.xAxisLabel')}
            </Tooltip>
          </span>
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
